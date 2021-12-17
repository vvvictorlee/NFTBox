import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";
import debug from "debug";
const apidebug = new debug("api:debug:token");
const apiinfo = new debug("api:info:token");
const apierror = new debug("api:error:token");

const ApiKeyToken = process.env.API_KEY || "";
const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
let apiDBMgmt = new APIDBMgmt();

export class TokenAPI {
  async syncOnChainDataOfTokenTx(raddress) {
    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";

    while (true) {
      try {
        let blocknumber = await apiDBMgmt.getLatestBlockByAccountFromTokenTx(
          address
        );
        const url =
          "https://api.hooscan.com//api?module=account&action=tokentx&address=" +
          address +
          "&startblock=" +
          blocknumber +
          "&endblock=99999999&sort=asc&apikey=" +
          ApiKeyToken +
          "";
        apidebug(url);
        const res = await fetch(url);
        const headerDate =
          res.headers && res.headers.get("date")
            ? res.headers.get("date")
            : "no response date";
        apidebug("Status Code:", res.status);
        apidebug(
          "syncOnChainDataOfTokenTx Date in Response header:",
          headerDate
        );

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

        apidebug(blocknumber, json.result);

        apidebug(blocknumber, json.result.length);
      } catch (err) {
        apierror(__line, __function, err.message);
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
}
