import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
let apidbmgmt = new APIDBMgmt();

export class TokenAPI {
  async syncOnChainDataOfTokenTx(raddress) {
    await apidbmgmt.init();

    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";
    let blocknumber = 0;
    const blocknumbers = await apidbmgmt.getLatestBlockByAccount(address);
    if (blocknumbers != undefined && !blocknumbers.is_empty()) {
      blocknumber = blocknumbers[0].latest;
    }

    let page = Number(1);
    while (true) {
      try {
        const res = await fetch(
          "https://api.hooscan.com//api?module=account&action=tokentx&address=" +
            address +
            "&startblock=" +
            blocknumber +
            "&endblock=99999999&page=" +
            page +
            "&offset=10000&sort=asc&apikey=YourApiKeyToken"
        );
        const headerDate =
          res.headers && res.headers.get("date")
            ? res.headers.get("date")
            : "no response date";
        console.log("Status Code:", res.status);
        console.log("Date in Response header:", headerDate);

        const json = await res.json();
        const txes = JSON.parse(json.result);
        if (txes.is_empty()) {
          break;
        }
        apidbmgmt.saveTokenTx(json.result);
        console.log(json);
        ++page;
      } catch (err) {
        console.log(err.message); //can be console.error
        break;
      }
    }
  }

  async getTokenTransferIn(address,year) {
    await apidbmgmt.init();
    return await apidbmgmt.getTokenTransferInByAccount(address);
  }
  async getTokenTransferInByMonth(address, year) {
    await apidbmgmt.init();
    let nextyear = Number(year) + 1;
    let startdt = new Date(year + "-01-01 00:00:00.000");
    let enddt = new Date(nextyear + "-01-01 00:00:00.000");
    let starttm = Date.parse(startdt) / 1000;
    let endtm = Date.parse(enddt) / 1000;
    console.log(starttm, endtm);
    return await apidbmgmt.getTokenTransferInByAccountAndMonth(
      address,
      starttm,
      endtm
    );
  }
}
