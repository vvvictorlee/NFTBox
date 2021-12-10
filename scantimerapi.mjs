import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";
const ApiKeyToken =
  process.env.API_KEY || "";
const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
let apiDBMgmt = new APIDBMgmt();
const scan_interval = process.env.SCAN_INTERVAL || 10000; //10 seconds

// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export class TimerAPI {
  
  async fetchAbiTimer() {
    console.log("==fetchabi==");

    while (true) {
      let tokenlist = await apiDBMgmt.getTokenContractInfo();
      for (t of tokenlist) {
        let price = 0;

        await apiDBMgmt.updateTokenPrice(t.contractAddress, price);
      }
      await sleep(scan_interval);
    }
  }

  async fetchAppInfoTimer() {
    console.log("==fetchAppInfo==");

    while (true) {
      let tokenlist = await apiDBMgmt.getTokenContractInfo();
      for (t of tokenlist) {
        let price = 0;

        await apiDBMgmt.updateTokenPrice(t.contractAddress, price);
      }
      await sleep(scan_interval);
    }
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
