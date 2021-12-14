import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";
import { readJSON, readCSV } from "./util.mjs";
import debug from "debug";
const apidebug = new debug("api");
import Web3 from "web3";
import BigNumber from "bignumber.js";

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
    console.log(data);
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

  //
  async fetchPriceFromHooEx() {
    try {
      const res = await fetch(
        "https://api.hoolgd.com/open/v1/tickers/all-market"
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      console.log("Status Code:", res.status);
      console.log("fetchPriceFromHooEx Date in Response header:", headerDate);

      const json = await res.json();

      //   console.log(json);
      this.parsePriceInfo(json);
    } catch (err) {
      console.log(err.message); //can be console.error
    }
  }
  async fetchPriceFromSwap() {
    console.log("Response Headers ============ ");

    let url = "https://n13.hg.network/subgraphs/name/pudding/hsc";

    const res = await fetch(url, {
      method: "POST",
      body: '{"operationName":"tokens","query":"fragment TokenFields on Token {  id  name  symbol  derivedETH  tradeVolume  tradeVolumeUSD  untrackedVolumeUSD  totalLiquidity  txCount  __typename}query tokens {  tokens(first: 200, orderBy: tradeVolumeUSD, orderDirection: desc) {    ...TokenFields    __typename  }}"}',
      headers: {
        "Content-Type": "text/plain",
      },
    });
    console.log("Response Headers ============ ");
    res.headers.forEach(function (v, i, a) {
      console.log(i + " : " + v);
    });
    const json = await res.text();
    this.parsePriceInfoFromSwap(json);
    console.log("Response Body ============ ", s);
    console.log(res);
  }

  async parseTokenInfo() {
    const csv = readCSV("./jsons/tokens.csv");
    const sym = csv.reduce((s, x) => {
      s[x[2].trim()] = x[8].trim();
      return s;
    }, {});
    // const sym = csv.map((x) => x[2].trim());
    return sym;
    // for (let x of sym) {
    //   console.log(x);
    // }
  }
  async parsePriceInfo(json) {
    const symaddress = await this.parseTokenInfo();
    const sym = Object.keys(symaddress); //.map(x=>x[0]);
    // const json = readJSON("./jsons/prices.json");
    // console.log(sym.length,sym)
    // const prices = json.data.filter(x=>{ const xx = x.symbol.split("-");return sym.indexOf(xx[0].trim())!=-1 && xx[1].trim()=="USDT"}).map((x) => [x.symbol.trim(),x.price.trim()]);
    const symp = json.data
      .filter((x) => {
        const xx = x.symbol.split("-");
        return sym.indexOf(xx[0].trim()) != -1 && xx[1].trim() == "USDT";
      })
      .map((x) => {
        const xx = x.symbol.split("-");
        return xx[0].trim();
      });
    const symnousdt = sym.filter((x) => symp.indexOf(x) == -1);
    // console.log(symnousdt,symnousdt.length,symp.length);

    const prices = json.data
      .filter((x) => {
        const xx = x.symbol.split("-");
        return symp.indexOf(xx[0].trim()) != -1;
      })
      .map((x) => {
        const xx = x.symbol.split("-");
        return [symaddress[xx[0].trim()], x.price.trim()];
      });

    console.log(prices, prices.length);
    const addresses = prices.map((x) => x[0]);
    apiDBMgmt.deleteTokenPrice(addresses);
    apiDBMgmt.saveTokenPrice(prices);
    // for (let x of prices) {
    //   console.log(x);
    // }
  }

  async parseTokenInfoFromSwap() {
    const json = readJSON("./jsons/puddingswap.json");
    const sym = json.tokens.reduce((s, x) => {
      s[x.symbol.trim()] = x.address.trim().toLowerCase();
      return s;
    }, {});
    // const sym = csv.map((x) => x[2].trim());
    return sym;
    // for (let x of sym) {
    //   console.log(x);
    // }
  }
  async parsePriceInfoFromSwap(json) {
    const symaddress = await this.parseTokenInfoFromSwap();
    const sym = Object.values(symaddress); //.map(x=>x[0]);
    // const json = readJSON("./jsons/swapprices.json");
    console.log(sym.length, sym);
    // const prices = json.data.filter(x=>{ const xx = x.symbol.split("-");return sym.indexOf(xx[0].trim())!=-1 && xx[1].trim()=="USDT"}).map((x) => [x.symbol.trim(),x.price.trim()]);
    const symp = json.data.tokens
      .filter((x) => {
        return (
          x.tradeVolume != "0" &&
          x.tradeVolumeUSD != "0" &&
          sym.indexOf(x.id.trim()) != -1
        );
      })
      .map((x) => {
        return x.id.trim();
      });
    const symnousdt = sym.filter((x) => symp.indexOf(x) == -1);
    // console.log(symnousdt,symnousdt.length,symp.length);

    const prices = json.data.tokens
      .filter((x) => {
        return (
          x.tradeVolume != "0" &&
          x.tradeVolumeUSD != "0" &&
          sym.indexOf(x.id.trim()) != -1
        );
      })
      .map((x) => {
        // return [symaddress[x.symbol.trim()], new BN(x.tradeVolumeUSD.trim()).div(new BN(x.tradeVolume.trim())).toString()];
        // return [x.symbol.trim(), new BN(x.tradeVolumeUSD.trim()).div(new BN(x.tradeVolume.trim())).toString()];
        // return [x.symbol.trim(), new BigNumber(x.tradeVolumeUSD.trim()).div(new BigNumber(x.tradeVolume.trim())).toFixed()];
        return [
          symaddress[x.symbol.trim()],
          new BigNumber(x.tradeVolumeUSD.trim())
            .div(new BigNumber(x.tradeVolume.trim()))
            .toFixed(),
        ];
        // return [symaddress[x.symbol.trim()], x.tradeVolumeUSD.trim(),x.tradeVolume.trim()];
      });

    console.log(prices, prices.length);
    // console.log(new BigNumber("1111").div(new BigNumber("9999")).toFixed());
    const addresses = prices.map((x) => x[0]);
    apiDBMgmt.deleteTokenPrice(addresses);
    apiDBMgmt.saveTokenPrice(prices);
    // for (let x of prices) {
    //   console.log(x);
    // }
  }

  async fetchAbiTimer() {
    console.log("==fetchabi==");

    while (true) {
      const addresses = await getTopTxCount();
      for (let address of addresses) {
        await syncTxAbiOfToAddress(address);
      }
      await sleep(scan_interval);
    }
  }

  async fetchAppInfoTimer() {
    console.log("==fetchAppInfo==");

    while (true) {
      //  await this.saveTokenContractInfo()
      await sleep(scan_interval);
    }
  }

  async fetchTokenPriceTimer() {
    console.log("==fetchTokenPriceTimer==");

    while (true) {
      await this.fetchPriceFromHooEx();
      await this.fetchPriceFromSwap();
      await sleep(scan_interval);
    }
  }
}
