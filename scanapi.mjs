import nodeFetch from "node-fetch";
import { TokenAPI } from "./scantokenapi.mjs";
import { LogAPI } from "./scanlogapi.mjs";
import { APIDBMgmt } from "./scanapidb.mjs";
import { TimerAPI } from "./scantimerapi.mjs";
import { TxMgmt } from "./txmgmt.mjs";
import "./utils.mjs";
import { writeCSV } from "./util.mjs";

import debug from "debug";
const apidebug = new debug("api:debug");
const apiinfo = new debug("api:info");
const apierror = new debug("api:error");
import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const ApiKeyToken = process.env.API_KEY || "";
console.log(PROVIDER_URL);
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
let apiDBMgmt = new APIDBMgmt();

export class ScanAPI {
  async testproxy() {
    let url =
      " http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=" +
      ApiKeyToken +
      "";
    let ip = "127.0.0.1";
    let port = "1187";
    const res = await fetch(url, {
      method: "GET",
      // body: null,
      redirect: "follow", // set to `manual` to extract redirect headers, `error` to reject redirect
      timeout: 10000, //ms
      agent: new HttpProxyAgent("http://" + ip + ":" + port),
    });
    apidebug("Response Headers ============ ");
    res.headers.forEach(function (v, i, a) {
      apidebug(i + " : " + v);
    });
    const s = await res.text();
    apidebug("Response Body ============ ", s);
    apidebug(res);
  }

  // 交易手续费(Tx Fee) = 实际运行步数(Actual Gas Used) * 单步价格(Gas Price)
  async syncOnChainData(raddress) {
    apidebug("=====in==syncOnChainData===raddress====", raddress);

    const address = raddress || "0xc19D04E8Fe2d28609866e80356c027924F23B1A5";
    let prevblocknumber = -1;
    let blocknumber = 0;
    while (true) {
      try {
        blocknumber = await apiDBMgmt.getLatestBlockByAccount(address);
        const url =
          "https://api.hooscan.com//api?module=account&action=txlist&address=" +
          address +
          "&startblock=" +
          blocknumber +
          "&endblock=99999999&page=1&offset=10000&sort=asc&apikey=" +
          ApiKeyToken +
          "";
        apidebug(url);
        const res = await fetch(url);
        const headerDate =
          res.headers && res.headers.get("date")
            ? res.headers.get("date")
            : "no response date";
        apidebug("Status Code:", res.status);
        apidebug("syncOnChainData Date in Response header:", headerDate);

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
        const jr = json.result.map((x) => {
          delete x.input;
          return x;
        });
        apiDBMgmt.saveTx(jr);
        apidebug("====json.result.length======", json.result.length);
      } catch (err) {
        apierror(__line, __function, err.message);
        break;
      }
      if (prevblocknumber == blocknumber) {
        break;
      }
      prevblocknumber = blocknumber;
    }
    apidebug("===syncOnChainData exit========");
  }

  // new Date(block.timestamp * 1000).toGMTString()
  async testtokenbalance() {
    try {
      const res = await fetch(
        "http://api.hooscan.com/api?module=account&action=tokenbalance&contractaddress=0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b&address=0x26ee42a4de70cebcde40795853eba4e492a9547f&tag=latest&apikey=" +
          ApiKeyToken +
          ""
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      apidebug("Status Code:", res.status);
      apidebug("testtokenbalance Date in Response header:", headerDate);

      const users = await res.json();
      // apiDBMgmt.saveTx(users.result);
      apidebug(users);
      // for(user of users) {
      //   apidebug(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      apierror(__line, __function, err.message);
    }
  }

  async getTokenBalance(address, contractAddress) {
    try {
      let url =
        "http://api.hooscan.com/api?module=account&action=tokenbalance&contractaddress=" +
        contractAddress +
        "&address=" +
        address +
        "&tag=latest&apikey=" +
        ApiKeyToken +
        "";
      apidebug(url);
      const res = await fetch(url);
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      apidebug("Status Code:", res.status);
      apidebug("testtokenbalance Date in Response header:", headerDate);

      const users = await res.json();
      // apiDBMgmt.saveTx(users.result);
      apidebug(users);
      // for(user of users) {
      //   apidebug(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
      return users.result;
    } catch (err) {
      apierror(__line, __function, err.message);
    }
    return 0;
  }

  async testinternal() {
    try {
      const res = await fetch(
        "http://api.hooscan.com/api?module=account&action=txlistinternal&address=0xEA54EAf095d66C6bFca2845dE895b2cAd65f6716&startblock=0&endblock=99999999999&sort=asc&apikey=" +
          ApiKeyToken +
          ""
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      apidebug("Status Code:", res.status);
      apidebug("testinternal Date in Response header:", headerDate);

      const users = await res.json();
      // apiDBMgmt.saveTx(users.result);
      apidebug(users);
      // for(user of users) {
      //   apidebug(`Got user with id: ${user.id}, name: ${user.name}`);
      // }
    } catch (err) {
      apierror(__line, __function, err.message);
    }
  }
  async testsum() {
    apiDBMgmt.getTx();
  }

  async getGasFeeReport(para) {
    try {
      const address = para.address;
      await this.syncOnChainData(address);
      await logApi.syncTxAbiOfToAddress(address);

      const totalgased = await apiDBMgmt.getTxGasedTotalByAccount(address);
      const gasedbycontract = await apiDBMgmt.getTxGasedTotalByAccountAndApp(
        address
      );
      const gasedbymethod = await apiDBMgmt.getTxGasedTotalByAccountAndMethod(
        address
      );

      return { totalgased, gasedbycontract, gasedbymethod };
    } catch (error) {
      apierror(__line, __function, error);
    }

    return {};
  }

  async getInteractiveReport(para) {
    const address = para.address;
    try {
      const firstlast = await apiDBMgmt.getEarliestAndLatestTxByAccount(
        address
      );
      const txcountbytimespan = await apiDBMgmt.getTxCountSpanByAccountAndMonth(
        para
      );
      const txcountbyapp = await apiDBMgmt.getTxCountByAccountAndApp(address);

      const total = await apiDBMgmt.getTxCountByAccount(address);
      return { total, firstlast, txcountbyapp, txcountbytimespan };
    } catch (error) {
      apierror(__line, __function, error);
    }
    return "error";
  }

  async getAssetReport(para) {
    try {
      await tokenApi.syncOnChainDataOfTokenTx(para.address);
      let total = await tokenApi.getTokenTransferInByAccount(para);
      let months = await tokenApi.getTokenTransferInByAccountAndMonth(para);
      let totalAmount = await tokenApi.getTokenTransferInAmountPriceByAccount(
        para
      );
      let monthsAmount =
        await tokenApi.getTokenTransferInAmountPriceByAccountAndMonth(para);
      return { total, months, totalAmount, monthsAmount };
    } catch (error) {
      console.error(error);
    }
    return "error";
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
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const timerAPI = new TimerAPI();
const txMgmt = new TxMgmt();
const testaddress = "0xd4D41Ec4D4D3b775b43A82CB5b0C61E0F114aB1D"; //"0xc19d04e8fe2d28609866e80356c027924f23b1a5";
const testtokenaddress = "0x6e250De4635f2A87c2CF092Dafd500787a6942b2";
// UnhandledPromiseRejectionWarning: BulkWriteError: E11000 duplicate key error collection: myapi2.blocklogs index: transactionHash_1 dup key: { transactionHash: "0x10ec02ef81fa39b8afc99fc02bfb2a01cb8b56c61bf4daf41651ddbf59a5204d" }
 let headers=["ADDRESS","BTC","ETH","USDT","USDC","WHOO","HOO"];
    let contractAddresses = [
      "0xAad9654a4df6973A92C1fd3e95281F0B37960CCd",
      "0xA1588dC914e236bB5AE4208Ce3081246f7A00193",
      "0xD16bAbe52980554520F6Da505dF4d1b124c815a7",
      "0x92a0bD4584c147D1B0e8F9185dB0BDa10B05Ed7e",
      "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
    ];
let handlers = {
  t: async function () {
    // apidebug(__line);
    // apidebug(__function);
    // apidebug(__function, __line);
    // await apiDBMgmt.init();
    // // await logApi.syncBlockLogsByContractAddress(testaddress);
    // apidebug("======syncBlockLogsByContractAddress====after========");
    // // await logApi.getEventNameFromAbiByContract(testtokenaddress);
    // const r = await timerAPI.parsePriceInfoFromSwap();
    // apidebug(r);
    // timerAPI.parseSame();
    // BTC合约"0xAad9654a4df6973A92C1fd3e95281F0B37960CCd"
    // ETH合约"0xA1588dC914e236bB5AE4208Ce3081246f7A00193"
    // USDT合约"0xD16bAbe52980554520F6Da505dF4d1b124c815a7"
    // USDC合约"0x92a0bD4584c147D1B0e8F9185dB0BDa10B05Ed7e"
    // Wrapped HOO合约"0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87"
    // 以及链币HOO
   
    let bl = await timerAPI.parseBlacklist();
    // bl = bl.slice(0, 1);
    // console.log(bl);

    let res = [headers];
    for (let b of bl) {
      let bres = [];
        bres.push(b[0]);
      for (let c of contractAddresses) {
        let a = await scanApi.getTokenBalance(b, c);
        // await sleep(200);
        // apidebug("=a=a====in =", a);
        bres.push(a);
      }
      let a = await web3.eth.getBalance(web3.utils.toChecksumAddress(b[0]));
    //   apidebug("=a=a====in =", a);
      bres.push(a);
      res.push(bres);
    }
    apiinfo("==res====in =", res);
    writeCSV("jsons/csv", res);
    console.log(res);
  },
  tt: async function () {
    let bl = await timerAPI.parseBlacklist();
    // bl = bl.slice(0, 1);
    // console.log(bl);
    let res = [headers];
    for (let b of bl) {
      let bres = [];
        bres.push(b[0]);
      for (let c of contractAddresses) {
        let a = await txMgmt.balance(web3.utils.toChecksumAddress(b[0]), c);
        apidebug("=a=a====in =", a);
        bres.push(a);
      }
      let a = await web3.eth.getBalance(web3.utils.toChecksumAddress(b[0]));
    //   apidebug("=a=a====in =", a);
      bres.push(a);
      res.push(bres);
    }
    apiinfo("==res====in =", res);
    writeCSV("jsons/ccsv", res);
    console.log(res);
  },
  abi: async function () {
    await apiDBMgmt.init();
    apidebug("======syncTxAbiOfToAddress============");
    const r = await timerAPI.fetchAbiTimer();
    apidebug(r);
  },
  info: async function () {
    await apiDBMgmt.init();
    apidebug("======fetchAppInfoTimer============");
    const r = await timerAPI.fetchAppInfoTimer();
    apidebug(r);
  },
  price: async function () {
    await apiDBMgmt.init();
    apidebug("======fetchTokenPriceTimer============");
    const r = await timerAPI.fetchTokenPriceTimer();
    apidebug(r);
  },
  default: async function () {},
};

// apidebug(process.argv);
const f = handlers[process.argv[3]] || handlers["default"];
f();
