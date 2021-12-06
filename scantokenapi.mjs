import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
let apiDBMgmt = new APIDBMgmt();
const scan_interval = process.env.SCAN_INTERVAL || 10000; //10 seconds

// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export class TokenAPI {
  async syncOnChainDataOfTokenTx(raddress) {

    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";

    while (true) {
      try {
        let blocknumber = await apiDBMgmt.getLatestBlockByAccount(address);

        const res = await fetch(
          "https://api.hooscan.com//api?module=account&action=tokentx&address=" +
            address +
            "&startblock=" +
            blocknumber +
            "&endblock=99999999&sort=asc&apikey=YourApiKeyToken"
        );
        const headerDate =
          res.headers && res.headers.get("date")
            ? res.headers.get("date")
            : "no response date";
        console.log("Status Code:", res.status);
        console.log("Date in Response header:", headerDate);

        const json = await res.json();
        if (
          json == undefined ||
          json == null ||
          json.result == undefined ||
          json.result == null ||
          json.result.length == 0
        ) {
          break;
        }
        apiDBMgmt.saveTokenTx(json.result);
        console.log(json.result.length);
      } catch (err) {
        console.log(err.message); //can be console.error
        break;
      }
    }
  }

  async getTokenTransferInByAccount(para) {
    return await apiDBMgmt.getTokenTransferInByAccount(para);
  }
  async getTokenTransferInByAccountAndMonth(para) {
    return await apiDBMgmt.getTokenTransferInByAccountAndMonth(para);
  }

  async getTokenTransferInAmountPriceByAccount(para) {
    return await apiDBMgmt.getTokenTransferInAmountPriceByAccount(para);
  }
  async getTokenTransferInAmountPriceByAccountAndMonth(para) {
    return await apiDBMgmt.getTokenTransferInAmountPriceByAccountAndMonth(para);
  }

  async fetchTokenPriceTimer() {
    console.log("==fetchtokenprice==");

    while (true) {
      let tokenlist = await apiDBMgmt.getTokenContractInfo();
      for (t of tokenlist) {
        let price = 0;

        await apiDBMgmt.updateTokenPrice(t.contractAddress, price);
      }
      await sleep(scan_interval);
    }
  }
}
