import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
let apidbmgmt = new APIDBMgmt();
const scan_interval = process.env.SCAN_INTERVAL || 10000;//10 seconds

// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export class TokenAPI {
  async syncOnChainDataOfTokenTx(raddress) {
    await apidbmgmt.init();

    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";
    let blocknumber = 0;
    const blocknumbers = await apidbmgmt.getLatestBlockByAccount(address);
    if (blocknumbers != undefined && !blocknumbers.length==0) {
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
        if (txes.length==0) {
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

  async getTokenTransferIn(address, startdatetime, enddatetime) {
    await apidbmgmt.init();
    return await apidbmgmt.getTokenTransferInByAccount(
      address,
      startdatetime,
      enddatetime
    );
  }
  async getTokenTransferInByMonth(address, startdatetime, enddatetime) {
    await apidbmgmt.init();

    console.log(starttm, endtm);
    return await apidbmgmt.getTokenTransferInByAccountAndMonth(
      address,
      startdatetime,
      enddatetime
    );
  }

  async fetchTokenPriceTimer() {
    console.log("==fetchtokenprice==");

    while (true) {
      let tokenlist = await apidbmgmt.getTokenContractInfo();
      for (t of tokenlist){
           let price = 0;

           await apidbmgmt.updateTokenPrice(t.contractAddress,price);
      }
      await sleep(scan_interval);
    }
  }

}
