import nodeFetch from "node-fetch";
import { TokenAPI } from "./scantokenapi.mjs";
import { LogAPI } from "./scanlogapi.mjs";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";

import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
let apiDBMgmt = new APIDBMgmt();

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
    console.log("=====in==syncOnChainData===raddress====", raddress);

    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";

    while (true) {
      try {
        let blocknumber = await apiDBMgmt.getLatestBlockByAccount(address);
        const res = await fetch(
          "https://api.hooscan.com//api?module=account&action=txlist&address=" +
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
        console.log("syncOnChainData Date in Response header:", headerDate);

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
        console.log("====json.result.length======", json.result.length);

        apiDBMgmt.saveTx(json.result);
        console.log("====json.result.length======", json.result.length);
      } catch (err) {
        console.log("====syncOnChainData===", err.message); //can be console.error
        break;
      }
    }
    console.log("===syncOnChainData exit========");
  }

  // new Date(block.timestamp * 1000).toGMTString()
  async testtokenbalance() {
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
      // apiDBMgmt.saveTx(users.result);
      console.log(users);
      // for(user of users) {
      //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      console.log(err.message); //can be console.error
    }
  }

  async testinternal() {
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
      // apiDBMgmt.saveTx(users.result);
      console.log(users);
      // for(user of users) {
      //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      console.log(err.message); //can be console.error
    }
  }
  async testsum() {
    apiDBMgmt.getTx();
  }

  async getGasFeeReport(para) {
    try {
      const address = para.address;
      console.log("=======syncOnChainData=========");
      await this.syncOnChainData(address);
      console.log("=====after==syncOnChainData=========");
      await logApi.syncTxAbiOfToAddress(address);

      const totalgased = await apiDBMgmt.getTxGasedTotalByAccount(address);
      const gasedbycontract = await apiDBMgmt.getTxGasedTotalByAccountAndApp(
        address
      );
    } catch (error) {
      console.log("==========", error);
    }

    return { totalgased, gasedbycontract };
  }

  async getInteractiveReport(para) {
    const address = para.address;
    const firstlast = await apiDBMgmt.getEarliestAndLatestTxByAccount(address);
    const txcountbytimespan = await apiDBMgmt.getTxCountSpanByAccountAndMonth(
      para
    );
    const txcountbyapp = await apiDBMgmt.getTxCountByAccountAndApp(address);

    const total = await apiDBMgmt.getTxCountByAccount(address, year);
    return { total, firstlast, txcountbyapp, txcountbytimespan };
  }

  async getAssetReport(para) {
    await tokenApi.syncOnChainDataOfTokenTx(address);
    let total = await tokenApi.getTokenTransferInByAccount(para);
    let months = await tokenApi.getTokenTransferInByAccountAndMonth(para);
    let totalAmount = await tokenApi.getTokenTransferInAmountPriceByAccount(
      para
    );
    let monthsAmount =
      await tokenApi.getTokenTransferInAmountPriceByAccountAndMonth(para);
    return { total, months, totalAmount, monthsAmount };
  }

  async addContractInfo(para) {
    const name = para.name;
    let tokens = para.addresses.map((addr) => {
      return { contractAddress: addr, appName: name };
    });
    await apiDBMgmt.saveContractInfo(tokens);
  }

  async addTokenPriceSource(para) {
    await apiDBMgmt.updateTokenPriceSource(para);
  }
}

const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";

let handlers = {
  t: async function () {
    // const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
    // ////token  transfer to
    // await apiDBMgmt.saveTokenContractInfo([
    //   { contractAddress: testaddress, price: "2.2" },
    // ]);
    // scanApi.test();\
    // testsum();
    // testinternal();
    // testtokentx();
    // testtokenbalance();
    // testcode();
    // testlogs();
    // testabi();
    console.log(__line);
    console.log(__function);
  },
  default: async function () {},
};

// console.log(process.argv);
const f = handlers[process.argv[3]] || handlers["default"];
f();
