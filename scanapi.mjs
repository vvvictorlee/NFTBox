import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import { TokenAPI } from "./scantokenapi.mjs";
import { LogAPI } from "./scanlogapi.mjs";

import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
let apidbmgmt = new APIDBMgmt();
export class ScanAPI {
  async testproxy() {
    //   try {
    //     const res = await fetch('http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken');
    //     const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
    //     console.log('Status Code:', res.status);
    //     console.log('Date in Response header:', headerDate);

    //     const users = await res.json();
    //     for(user of users) {
    //       console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    //     }
    //   } catch (err) {
    //     console.log(err.message); //can be console.error
    //   }
    let url =
      " http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken";
    let ip = "127.0.0.1";
    let port = "1187";
    const res = await fetch(url, {
      method: "GET",
      // body: null,
      redirect: "follow", // set to `manual` to extract redirect headers, `error` to reject redirect
      timeout: 10000, //ms
      agent: new HttpProxyAgent("http://" + ip + ":" + port),
    });
    console.log("Response Headers ============ ");
    res.headers.forEach(function (v, i, a) {
      console.log(i + " : " + v);
    });
    const s = await res.text();
    console.log("Response Body ============ ", s);
    console.log(res);
  }

  // 交易手续费(Tx Fee) = 实际运行步数(Actual Gas Used) * 单步价格(Gas Price)
  async syncOnChainData(raddress) {
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
          "https://api.hooscan.com//api?module=account&action=txlist&address=" +
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
        apidbmgmt.saveTx(json.result);
        console.log(json);
        ++page;
      } catch (err) {
        console.log(err.message); //can be console.error
        break;
      }
    }
    await this.syncTxAbiOfToAddress(raddress);
  }

  // new Date(block.timestamp * 1000).toGMTString()
  async testtokenbalance() {
    await apidbmgmt.init();
    try {
      const res = await fetch(
        "http://api.hooscan.com/api?module=account&action=tokenbalance&contractaddress=0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b&address=0x26ee42a4de70cebcde40795853eba4e492a9547f&tag=latest&apikey=YourApiKeyToken"
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      console.log("Status Code:", res.status);
      console.log("Date in Response header:", headerDate);

      const users = await res.json();
      // apidbmgmt.saveTx(users.result);
      console.log(users);
      // for(user of users) {
      //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      console.log(err.message); //can be console.error
    }
  }

  async testinternal() {
    await apidbmgmt.init();
    try {
      const res = await fetch(
        "http://api.hooscan.com/api?module=account&action=txlistinternal&address=0xEA54EAf095d66C6bFca2845dE895b2cAd65f6716&startblock=0&endblock=99999999999&sort=asc&apikey=YourApiKeyToken"
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      console.log("Status Code:", res.status);
      console.log("Date in Response header:", headerDate);

      const users = await res.json();
      // apidbmgmt.saveTx(users.result);
      console.log(users);
      // for(user of users) {
      //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      console.log(err.message); //can be console.error
    }
  }
  async testsum() {
    await apidbmgmt.init();
    apidbmgmt.getTx();
  }

  async syncTxAbiOfToAddress(address) {
    let toes = apidbmgmt.getTxToByAccount(address);
    let accounts = [];
    let contracts = [];
    for (to of toes) {
      let flag = await testcode(to._id);
      if (flag) {
        let res = await testabi(to._id);
        if (!res.is_empty()) {
          contracts.push({ contractAddress: to._id });
        }
      } else {
        accounts.push({ accountAddress: to._id });
      }
    }
    if (!contracts.is_empty()) {
      apidbmgmt.saveContract(contracts);
    }
    if (!accounts.is_empty()) {
      apidbmgmt.saveAccountAddress(accounts);
    }
  }

  async getGasFeeReport(address, detailType) {
    await this.syncOnChainData(address);
    if (detailType == undefined) {
      return await apidbmgmt.getTxGasedTotalByAccount(address);
    }
    return await apidbmgmt.getTxGasedTotalByAccountAndContract(address);
  }
  async getInteractiveReport(address, detailType, year) {
    await apidbmgmt.init();
    if (detailType == "first") {
      return await apidbmgmt.getEarliestAndLatestTxByAccount(address);
    }

    await apidbmgmt.getTxCountByAccount(address, year);
  }

  async getAssetReport(address, year) {
    await tokenApi.syncOnChainDataOfTokenTx(address);
    let total = await tokenApi.getTokenTransferIn(address, year);
    let months = await tokenApi.getTokenTransferInByMonth(address, year);
    return { total, months };
  }
}
const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";
let handlers = {
  t: async function () {
    scanApi.test();
    // testsum();
    // testinternal();
    // testtokentx();
    // testtokenbalance();
    // testcode();
    // testlogs();
    // testabi();
  },
  to: async function () {
    scanApi.testtxto(testaddress);
  },
  tt: async function () {
    ////total gased  by account
    scanApi.testtxtotal(testaddress);
  },
  el: async function () {
    ////total gased  by account
    scanApi.testel(testaddress);
  },
  tc: async function () {
    scanApi.testtxcontract(testaddress);
  },
  ti: async function () {
    const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
    ////token  transfer to
    tokenApi.testtokenin(testaddress);
  },
  tm: async function () {
    const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
    ////token  transfer to  by month
    tokenApi.testtokeninm(testaddress, 2021);
  },
  default: async function () {},
};

// console.log(process.argv);
const f = handlers[process.argv[3]] || handlers["default"];
f();
