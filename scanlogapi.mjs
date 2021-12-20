import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";
import "./utils.mjs";
import debug from "debug";
const apidebug = new debug("api:debug:log");
const apiinfo = new debug("api:info:log");
const apierror = new debug("api:error:log");
import Web3 from "web3";
const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const ApiKeyToken = process.env.API_KEY || "";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let apiDBMgmt = new APIDBMgmt();
const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";
export class LogAPI {
  async syncBlockLogsByContractAddress(raddress) {
    const address = raddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
    try {
      const url =
        "http://api.hooscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=" +
        address +
        "&apikey=" +
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
        "syncBlockLogsByContractAddress Date in Response header:",
        headerDate
      );
      const json = await res.json();
      //   apidebug(json.result);
      let logs = json.result;
      //   const eventsig2name = await getEventNameFromAbiByContract(address);
      let hashset = new Set();
      logs = logs.filter((a) => {
        if (hashset.has(a.transactionHash)) {
          return false;
        }
        hashset.add(a.transactionHash);
        return true;
      });
      const t = logs.map((a) => {
        a["timeStamp"] = web3.utils.hexToNumber(a.timeStamp);
        a["gasPrice"] = web3.utils.hexToNumber(a.gasPrice);
        a["gasUsed"] = web3.utils.hexToNumber(a.gasUsed);
        a["eventName"] = a.topics[0];
        return a;
      });
      //   apidebug(t);
      await apiDBMgmt.saveBlockLogs(t);
    } catch (err) {
      apierror(__line, __function, err.message);
      return 0;
    }
    return 1;
  }

  async syncTxAbiOfToAddress(address) {
    try {
      let toes = await apiDBMgmt.getTxToByAccount(address);
      let accounts = [];
      let contracts = [];

      if (toes.length > 10) {
        toes.splice(10);
      }

      for (let to of toes) {
        let flag = await this.geContractCode(to._id);

        if (flag != undefined && flag != null && flag) {
          let res = await this.getEventNameFromAbiByContract(to._id);

          if (res != undefined && res != null && res > 0) {
            contracts.push({ contractAddress: to._id });
            const flag = await this.syncBlockLogsByContractAddress(to._id);
            if (flag != 0) {
              let events = await apiDBMgmt.getTxEventNameByAccount(to._id);
              await apiDBMgmt.saveTxHashEventName(events);
            }
          } else {
            contracts.push({ contractAddress: to._id, verified: "unverified" });
          }
        } else {
          accounts.push({ accountAddress: to._id });
        }
      }

      if (contracts.length > 0) {
      apidebug("====== if (contracts.length > 0)============",contracts);
        await apiDBMgmt.saveContract(contracts);
      }
      if (accounts.length > 0) {
        await apiDBMgmt.saveAccountAddress(accounts);
      }
    } catch (error) {
      apierror(__line, __function, error);
    }
  }

  async geContractCode(raddress) {
    const address = raddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
    let code = web3.eth.getCode(address);
    return code != "0x";
  }

  async getEventNameFromAbiByContract(rcontractAddress) {
    const contractAddress =
      rcontractAddress || "0xc953e0ce3c498A04e5c3C1CA0D7BA365326f734d";
    try {
      const res = await fetch(
        "http://api.hooscan.com/api?module=contract&action=getabi&address=" +
          contractAddress +
          "&apikey=" +
          ApiKeyToken +
          ""
      );
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      apidebug("Status Code:", res.status);
      apidebug(
        "getEventNameFromAbiByContract Date in Response header:",
        headerDate
      );

      const json = await res.json();
      apidebug(json);
      if (
        json != undefined &&
        json != null &&
        json.result != undefined &&
        json.result != null &&
        json.status != undefined &&
        json.status != null &&
        json.status == 1
      ) {
        const abi = JSON.parse(json.result);
        //
        const events = abi
          .filter((a) => a.type == "event")
          .map((a) => {
            return {
              eventName: a.name,
              eventSignature: web3.eth.abi.encodeEventSignature(a),
            };
          });
        apidebug(events);
        try {
          apiDBMgmt.saveEventSignature(events);
        } catch (error) {
          apierror(__line, __function, error);
        }
        // const es = events.reduce((s, a) => {
        //   s[a.eventSignature] = a.eventName;
        //   return s;
        // }, {});
        // apidebug(es);
        // // for(user of users) {
        // //   apidebug(`Got user with id: ${user.id}, name: ${user.name}`);
        // // }
        // return es;
        return 1;
      }
    } catch (err) {
      apierror(__line, __function, err.message);
    }
    return 0;
  }
}
