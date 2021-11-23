import nodeFetch from "node-fetch";
import Tx from "./models/TxModel.mjs";
import TokenTx from "./models/TokenTxModel.mjs";
import BlockLogs from "./models/BlockLogsModel.mjs";
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
  async getTx() {
    let s = await Tx.aggregate([
      { $group: { _id: "$from", gased: { $sum: { $toDouble: "$gasUsed" } } } },
    ]);
    console.log(s);
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


async function testlogs() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "http://api.hooscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d&apikey=YourApiKeyToken"
    );
    const headerDate =
      res.headers && res.headers.get("date")
        ? res.headers.get("date")
        : "no response date";
    console.log("Status Code:", res.status);
    console.log("Date in Response header:", headerDate);

    const users = await res.json();
    apidbmgmt.saveBlockLogs(users.result);
    console.log(users);
    // for(user of users) {
    //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    // }
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

async function testcode() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "http://api.hooscan.com/api?module=proxy&action=eth_getCode&address=0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b&tag=latest&apikey=YourApiKeyToken"
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


// var Web3 = require('web3');
// var web3 = new Web3(new Web3.providers.HttpProvider());
// var version = web3.version.api;

// $.getJSON('http://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', function (data) {
//     var contractABI = "";
//     contractABI = JSON.parse(data.result);
//     if (contractABI != ''){
//         var MyContract = web3.eth.contract(contractABI);
//         var myContractInstance = MyContract.at("0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359");
//         var result = myContractInstance.memberId("0xfe8ad7dd2f564a877cc23feea6c0a9cc2e783715");
//         console.log("result1 : " + result);            
//         var result = myContractInstance.members(1);
//         console.log("result2 : " + result);
//     } else {
//         console.log("Error" );
//     }            
// });

async function testabi() {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  try {
    const res = await fetch(
      "http://api.hooscan.com/api?module=contract&action=getabi&address=0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d&apikey=YourApiKeyToken"
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
let handlers = {
  t: async function () {
    // test();
    // testsum();
    // testinternal();
    // testtokentx();
    // testtokenbalance();
    // testcode();
testlogs();
// testabi();
  },

  default: async function () {},
};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();
