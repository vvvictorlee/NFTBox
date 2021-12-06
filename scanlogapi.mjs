import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";

import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let apiDBMgmt = new APIDBMgmt();
const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
export class LogAPI {
  async testlogs(raddress) {
    const address = raddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
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
      console.log("testlogs Date in Response header:", headerDate);
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

  async syncTxAbiOfToAddress(address) {
    try {
      let toes = await apiDBMgmt.getTxToByAccount(address);
      console.log("toes=======", toes.length);
      let accounts = [];
      let contracts = [];
      for (let to of toes) {
        console.log(to, "toes===for begin====", toes.length);

        let flag = await this.testcode(to._id);
        console.log("toes===for mid====", toes.length);

        if (flag != undefined && flag != null && flag) {
          console.log("testabi===for mid====", toes.length);

          let res = await this.testabi(to._id);

          if (res != undefined && res != null && res.length > 0) {
            contracts.push({ contractAddress: to._id });
            console.log("testabi===for after====", toes.length);
          }
        } else {
          accounts.push({ accountAddress: to._id });
        }
      }
      console.log("toes===while exit====", toes.length);

      if (contracts.length > 0) {
        await apiDBMgmt.saveContract(contracts);
      }
      if (accounts.length > 0) {
        await apiDBMgmt.saveAccountAddress(accounts);
      }
    } catch (error) {
      console.log("=========syncTxAbiOfToAddress===error====", error);
    }
  }

  async testcode(raddress) {
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

  async testabi(rcontractAddress) {
    const contractAddress =
      rcontractAddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
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
      console.log("testabi Date in Response header:", headerDate);

      const json = await res.json();
      console.log(json);
      if (
        json != undefined &&
        json != null &&
        json.result != undefined &&
        json.result != null
      ) {
        const abi = JSON.parse(json.result);
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
      }
    } catch (err) {
      console.log("=======testabi=========", err.message); //can be console.error
    }
  }
}
