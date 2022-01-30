import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";
import { readJSON, readCSV } from "./util.mjs";
import debug from "debug";
const apidebug = new debug("api:debug:timer");
const apiinfo = new debug("api:info:timer");
const apierror = new debug("api:error:timer");

import Web3 from "web3";
import BigNumber from "bignumber.js";
import { LogAPI } from "./scanlogapi.mjs";
const logApi = new LogAPI();

const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
const BN = web3.utils.BN;
const ApiKeyToken = process.env.API_KEY || "";
const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
let apiDBMgmt = new APIDBMgmt();
const scan_interval = process.env.SCAN_INTERVAL || 10000; //10 seconds

// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

// import { createClient } from "urql";

// const APIURL = "https://api.thegraph.com/subgraphs/name/username/subgraphname";

// const tokensQuery = `
//   query {
//     tokens {
//       id
//       tokenID
//       contentURI
//       metadataURI
//     }
//   }
// `;

// const client = createClient({
//   url: APIURL,
// });

import child_process from "child_process";

export class TimerAPI {
  async testql() {
    const data = await client.query(tokensQuery).toPromise();
    apidebug(data);
  }
  async testqa() {
    var cmd =
      ' curl --location --request POST \'https://n13.hg.network/subgraphs/name/pudding/hsc\' --header \'Content-Type: text/plain\'  --data-raw \'{"operationName":"tokens","query":"fragment TokenFields on Token {  id  name  symbol  derivedETH  tradeVolume  tradeVolumeUSD  untrackedVolumeUSD  totalLiquidity  txCount  __typename}query tokens {  tokens(first: 200, orderBy: tradeVolumeUSD, orderDirection: desc) {    ...TokenFields    __typename  }}"}\'';
    //    var cmd =
    //     " curl --location --request POST 'https://n13.hg.network/subgraphs/name/pudding/hsc' --header 'Content-Type: text/plain'  --data-raw '{\"operationName\":\"tokens\",\"query\":\"fragment TokenFields on Token {\n  id\n  name\n  symbol\n  derivedETH\n  tradeVolume\n  tradeVolumeUSD\n  untrackedVolumeUSD\n  totalLiquidity\n  txCount\n  __typename\n}\n\nquery tokens {\n  tokens(first: 200, orderBy: tradeVolumeUSD, orderDirection: desc) {\n    ...TokenFields\n    __typename\n  }\n}\n\"}'";

    var resp = child_process.execSync(cmd);
    var result = resp.toString("UTF8");
    return result;
  }
  async fetchPriceFromHooEx() {
    try {
      const res = await fetch(
        "https://api.hoolgd.com/open/v1/tickers/all-market"
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      apidebug("Status Code:", res.status);
      apidebug("fetchPriceFromHooEx Date in Response header:", headerDate);

      const json = await res.json();

      //   apidebug(json);
      await this.parsePriceInfo(json);
    } catch (err) {
      apierror(__line, __function, err.message);
    }
  }
  async fetchPriceFromSwap() {
    let url = "https://n13.hg.network/subgraphs/name/pudding/hsc";

    const res = await fetch(url, {
      method: "POST",
      body: '{"operationName":"tokens","query":"fragment TokenFields on Token {  id  name  symbol  derivedETH  tradeVolume  tradeVolumeUSD  untrackedVolumeUSD  totalLiquidity  txCount  __typename}query tokens {  tokens(first: 200, orderBy: tradeVolumeUSD, orderDirection: desc) {    ...TokenFields    __typename  }}"}',
      headers: {
        "Content-Type": "text/plain",
      },
    });
    apidebug("Response Headers ============ ");
    res.headers.forEach(function (v, i, a) {
      apidebug(i + " : " + v);
    });
    const json = await res.text();
    apidebug(json);

    await this.parsePriceInfoFromSwap(JSON.parse(json));
  }

  async parseTokenInfo() {
    const csv = readCSV("./jsons/tokens.csv");
    const sym = csv.reduce((s, x) => {
      if (x[8].trim() != "") {
        s[x[2].trim()] = x[8].trim();
      }
      return s;
    }, {});
    return sym;
  }

  async parsePriceInfo(json) {
    const symaddress = await this.parseTokenInfo();
    const sym = Object.keys(symaddress); //.map(x=>x[0]);
    const symp = json.data
      .filter((x) => {
        const xx = x.symbol.split("-");
        return sym.indexOf(xx[0].trim()) != -1 && xx[1].trim() == "USDT";
      })
      .map((x) => {
        const xx = x.symbol.split("-");
        return xx[0].trim();
      });
    // const symnousdt = sym.filter((x) => symp.indexOf(x) == -1);
    let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

    const prices = json.data
      .filter((x) => {
        const xx = x.symbol.split("-");
        return symp.indexOf(xx[0].trim()) != -1 && xx[1].trim() == "USDT";
      })
      .map((x) => {
        const xx = x.symbol.split("-");
        if (symaddress[xx[0].trim()] == "") {
          apiinfo(xx, "empty");
        }
        return {
          contractAddress: symaddress[xx[0].trim()],
          price: x.price.trim(),
          lastUpdateTime: now,
        };
      });

    prices.map((price, index) => apidebug(price, index));

    const addresses = prices.map((x) => x.contractAddress);
    apiDBMgmt.deleteTokenPrice(addresses);
    apiDBMgmt.saveTokenPrice(prices);
  }

  async parseTokenInfoFromSwap() {
    const json = readJSON("./jsons/puddingswap.json");
    const sym = json.tokens.reduce((s, x) => {
      if (x.address != undefined && x.address.trim() != "") {
        s[x.symbol.trim()] = x.address.trim().toLowerCase();
      } else {
        apiinfo(x);
      }
      return s;
    }, {});
    return sym;
  }
  async parsePriceInfoFromSwap(json) {
    const symaddress = await this.parseTokenInfoFromSwap();
    const sym = Object.values(symaddress); //.map(x=>x[0]);
    let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

    const prices = json.data.tokens
      .filter((x) => {
        return (
          x.tradeVolume != "0" &&
          x.tradeVolumeUSD != "0" &&
          sym.indexOf(x.id.trim()) != -1
        );
      })
      .map((x) => {
        return {
          contractAddress: x.id.trim().toLowerCase(),
          price: new BigNumber(x.tradeVolumeUSD.trim())
            .div(new BigNumber(x.tradeVolume.trim()))
            .toFixed(),
          lastUpdateTime: now,
        };
      });

    prices.map((price, index) => apidebug(price, index));

    const addresses = prices.map((x) => x.contractAddress);
    apiDBMgmt.deleteTokenPrice(addresses);
    apiDBMgmt.saveTokenPrice(prices);
  }

  async fetchAbiTimer() {
    apiinfo("==fetchabi==");

    while (true) {
      let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
      apiinfo("==fetchAbiTimer====in =", now);
      const addresses = await apiDBMgmt.getTopTxCount();
      for (let address of addresses) {
        await logApi.syncTxAbiOfToAddress(address);
      }
      await sleep(scan_interval);
    }
  }

  async fetchAppInfoTimer() {
    apiinfo("==fetchAppInfo==");

    while (true) {
      await sleep(scan_interval);
    }
  }

  async fetchTokenPriceTimer() {
    apiinfo("==fetchTokenPriceTimer==");

    while (true) {
      let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
      apiinfo("==fetchTokenPriceTimer====in =", now);

      await this.fetchPriceFromHooEx();
      await this.fetchPriceFromSwap();
      await sleep(scan_interval);
    }
  }

  async parseSame() {
    const json = readJSON("./jsons/0xfeff4.json");
    const sym = json.result.reduce((s, x) => {
    if (s[x.from] == undefined) {
        s[x.from] = Number(0);
      }
      if (s[x.to] == undefined) {
        s[x.to] = Number(0);
      }
      s[x.from] -= Number(x.value);
      s[x.to] += Number(x.value);

      return s;
    }, {});
     apiinfo("==sym====in =", sym);
    console.log("====")
  }

async parseBlacklist() {
    const csv = readCSV("./json/220130_black_address.csv");
    // apiinfo("==csv====in =", csv);
    console.log("====")
    return csv;
  }

}
