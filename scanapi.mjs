import nodeFetch from "node-fetch";
import Tx from "./models/TxModel.mjs";
import TokenTx from "./models/TokenTxModel.mjs";
import BlockLogs from "./models/BlockLogsModel.mjs";
import EventSignature from "./models/EventSignatureModel.mjs";
import Contract from "./models/ContractModel.mjs";
import mongoose from "mongoose";
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

class APIDBMgmt {
  async init() {
    // DB connection
    var MONGODB_URL = process.env.MONGODB_URL;
    mongoose
      .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== "test") {
          console.log("Connected to %s", MONGODB_URL);
          console.log("App is running ... \n");
          console.log("Press CTRL + C to stop the process. \n");
        }
      })
      .catch((err) => {
        console.error("App starting error:", err.message);
        process.exit(1);
      });
    var db = mongoose.connection;
  }
  _badgedetail = null;
  _ip = null;
  async saveTx(tx) {
    Tx.insertMany(tx);
  }
  async saveTokenTx(tokenTx) {
    TokenTx.insertMany(tokenTx);
  }
  async saveBlockLogs(blockLogs) {
    BlockLogs.insertMany(blockLogs);
  }
  async saveEventSignature(eventSignatures) {
    EventSignature.insertMany(eventSignatures);
  }
  async saveContract(contract) {
    Contract.insertMany(contract);
  }
  async getTxGasedTotalByAccount(address) {
    // const reg = new RegExp(address, "i"); //ignorecase{ $regex: reg }
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$from",
          gasedhoo: {
            $sum: {
              $multiply: [
                { $toDouble: "$gasPrice" },
                { $toDouble: "$gasUsed" },
                0.000000000000000001,
              ],
            },
          },
        },
      },
    ]);
    console.log(s);
    return s;
  }

  async getTxGasedTotalByAccountAndContract(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$to",
          gased: {
            $sum: {
              $multiply: [
                { $toDouble: "$gasPrice" },
                { $toDouble: "$gasUsed" },
                0.000000000000000001,
              ],
            },
          },
        },
      },
    ]);
    console.log(s);
    return s;
  }

  async getTokenTransferInByAccount(address) {
    let s = await TokenTx.aggregate([
      {
        $match: {
          to: address,
        },
      },
      {
        $group: {
          _id: "$contractAddress",
          tokenName: { $min: "$tokenName" },
          tokenSymbol: { $min: "$tokenSymbol" },
          tokenDecimal: { $min: "$tokenDecimal" },
          amount: {
            $sum: {
              $divide: [
                { $toDecimal: "$value" },
                { $toDecimal: { $pow: [10, { $toDouble: "$tokenDecimal" }] } },
              ],
            },
          },
          amounts: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $addFields: {
          amountstr: { $toString: "$amount" },
          amountstrs: { $toString: "$amounts" },
        },
      },
    ]);
    console.log(s);
    return s;
  }

  async getTokenTransferInByAccountAndMonth(address, starttm, endtm) {
    let s = await TokenTx.aggregate([
      {
        $project: {
          to: "$to",
          value: "$value",
          contractAddress: "$contractAddress",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
          timeStamp: { $toDouble: "$timeStamp" },
        },
      },
      {
        $match: {
          $and: [
            {
              to: address,
            },
            { timeStamp: { $gte: starttm, $lt: endtm } },
          ],
        },
      },
      {
        $group: {
          _id: [
            "$contractAddress",
            {
              $month: {
                $toDate: {
                  $multiply: [
                    { $add: [{ $toDouble: "$timeStamp" }, 28800] },
                    1000,
                  ],
                },
              },
            },
          ],
          tokenName: { $last: "$tokenName" },
          tokenSymbol: { $last: "$tokenSymbol" },
          tokenDecimal: { $last: "$tokenDecimal" },
          month: {
            $min: {
              $month: {
                $toDate: {
                  $multiply: [
                    { $add: [{ $toDouble: "$timeStamp" }, 28800] },
                    1000,
                  ],
                },
              },
            },
          },
          amount: {
            $sum: {
              $divide: [
                { $toDecimal: "$value" },
                { $toDecimal: { $pow: [10, { $toDouble: "$tokenDecimal" }] } },
              ],
            },
          },
          amounts: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $addFields: {
          amountstr: { $toString: "$amount" },
          amountstrs: { $toString: "$amounts" },
        },
      },
    ]);
    console.log(s);
    return s;
  }
}

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";

async function testproxy() {
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
async function test() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "https://api.hooscan.com//api?module=account&action=txlist&address=0xc19D04E8Fe2d28609866e80356c027924F23B1A5&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken"
    );
    const headerDate =
      res.headers && res.headers.get("date")
        ? res.headers.get("date")
        : "no response date";
    console.log("Status Code:", res.status);
    console.log("Date in Response header:", headerDate);

    const users = await res.json();
    apidbmgmt.saveTx(users.result);
    console.log(users);
    // for(user of users) {
    //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    // }
  } catch (err) {
    console.log(err.message); //can be console.error
  }
}
// new Date(block.timestamp * 1000).toGMTString()
async function testtokenbalance() {
  let apidbmgmt = new APIDBMgmt();
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

async function testtokentx() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "http://api.hooscan.com/api?module=account&action=tokentx&address=0xEA54EAf095d66C6bFca2845dE895b2cAd65f6716&startblock=0&endblock=99999999999&sort=asc&apikey=YourApiKeyToken"
    );
    const headerDate =
      res.headers && res.headers.get("date")
        ? res.headers.get("date")
        : "no response date";
    console.log("Status Code:", res.status);
    console.log("Date in Response header:", headerDate);

    const users = await res.json();
    apidbmgmt.saveTokenTx(users.result);
    console.log(users);
    // for(user of users) {
    //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    // }
  } catch (err) {
    console.log(err.message); //can be console.error
  }
}

async function testlogs(raddress) {
  const address = raddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const url =
      "http://api.hooscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=" +
      address +
      "&apikey=YourApiKeyToken";
    console.log(url);
    const res = await fetch(url);
    const headerDate =
      res.headers && res.headers.get("date")
        ? res.headers.get("date")
        : "no response date";
    console.log("Status Code:", res.status);
    console.log("Date in Response header:", headerDate);
    const json = await res.json();
    console.log(json.result);
    const logs = json.result;
    const eventsig2name = await testabi(address);
    const t = logs.map((a) => {
      a["eventName"] =
        eventsig2name[a.topics[0]] == undefined
          ? a.topics[0]
          : eventsig2name[a.topics[0]];
      return {
        transactionHash: a.transactionHash,
        timeStamp: web3.utils.hexToNumber(a.timeStamp),
        gasPrice: web3.utils.hexToNumber(a.gasPrice),
        gasUsed: web3.utils.hexToNumber(a.gasUsed),
        eventName: a.eventName,
      };
    });
    console.log(t);
    // apidbmgmt.saveBlockLogs(json.result);
  } catch (err) {
    console.log(err.message); //can be console.error
  }
}

async function testcode(raddress) {
  const address = raddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
  let code = web3.eth.getCode(address);
  return code != "0x";
  //   let apidbmgmt = new APIDBMgmt();
  //   await apidbmgmt.init();
  //   try {
  //     const res = await fetch(
  //       "http://api.hooscan.com/api?module=proxy&action=eth_getCode&address=" +
  //         address +
  //         "&tag=latest&apikey=YourApiKeyToken"
  //     );
  //     const headerDate =
  //       res.headers && res.headers.get("date")
  //         ? res.headers.get("date")
  //         : "no response date";
  //     console.log("Status Code:", res.status);
  //     console.log("Date in Response header:", headerDate);

  //     const json = await res.json();
  //     console.log(json);
  //     const code = JSON.parse(json.result);
  //     // for(user of users) {
  //     //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
  //     // }
  //   } catch (err) {
  //     console.log(err.message); //can be console.error
  //   }
}

import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

async function testabi(rcontractAddress) {
  const contractAddress =
    rcontractAddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "http://api.hooscan.com/api?module=contract&action=getabi&address=" +
        contractAddress +
        "&apikey=YourApiKeyToken"
    );
    const headerDate =
      res.headers && res.headers.get("date")
        ? res.headers.get("date")
        : "no response date";
    console.log("Status Code:", res.status);
    console.log("Date in Response header:", headerDate);

    const re = await res.json();
    const abi = JSON.parse(re.result);
    // console.log(abi);
    //
    const events = abi
      .filter((a) => a.type == "event")
      .map((a) => {
        return {
          contractAddress: contractAddress,
          eventName: a.name,
          eventSignature: web3.eth.abi.encodeEventSignature(a),
        };
      });
    console.log(events);
    try {
      apidbmgmt.saveEventSignature(events);
      apidbmgmt.saveContract([contractAddress]);
    } catch (error) {
      console.error(error);
    }

    const es = events.reduce((s, a) => {
      s[a.eventSignature] = a.eventName;
      return s;
    }, {});
    console.log(es);
    // for(user of users) {
    //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    // }
    return es;
  } catch (err) {
    console.log(err.message); //can be console.error
  }
}

async function testinternal() {
  let apidbmgmt = new APIDBMgmt();
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
async function testsum() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  apidbmgmt.getTx();
}
async function testtxtotal(address) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  apidbmgmt.getTxGasedTotalByAccount(address);
}

async function testtxcontract(address) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  apidbmgmt.getTxGasedTotalByAccountAndContract(address);
}
async function testtokenin(address) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  apidbmgmt.getTokenTransferInByAccount(address);
}
async function testtokeninm(address, year) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  let nextyear = Number(year) + 1;
  let startdt = new Date(year + "-01-01 00:00:00.000");
  let enddt = new Date(nextyear + "-01-01 00:00:00.000");
  let starttm = Date.parse(startdt) / 1000;
  let endtm = Date.parse(enddt) / 1000;
  console.log(starttm, endtm);
  //1623484787
  //1609430400000
  // 1609430400
  // 1640966400
  apidbmgmt.getTokenTransferInByAccountAndMonth(address, starttm, endtm);
}
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";
let handlers = {
  t: async function () {
    test();
    // testsum();
    // testinternal();
    // testtokentx();
    // testtokenbalance();
    // testcode();
    // testlogs();
    // testabi();
  },
  tt: async function () {
    testtxtotal(testaddress);
  },
  tc: async function () {
    testtxcontract(testaddress);
  },
  ti: async function () {
    const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
    testtokenin(testaddress);
  },
  tm: async function () {
    const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
    testtokeninm(testaddress, 2021);
  },
  default: async function () {},
};

// console.log(process.argv);
const f = handlers[process.argv[3]] || handlers["default"];
f();
