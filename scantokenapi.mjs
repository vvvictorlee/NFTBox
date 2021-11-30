import nodeFetch from "node-fetch";
import { APIDBMgmt } from "./scanapidb.mjs";

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => nodeFetch(url, init));
import HttpProxyAgent from "http-proxy-agent";

export class TokenAPI{
async  testtokentx() {
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

async  testtokenin(address) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  apidbmgmt.getTokenTransferInByAccount(address);
}
async  testtokeninm(address, year) {
  let apidbmgmt = new APIDBMgmt();
  await apidbmgmt.init();
  let nextyear = Number(year) + 1;
  let startdt = new Date(year + "-01-01 00:00:00.000");
  let enddt = new Date(nextyear + "-01-01 00:00:00.000");
  let starttm = Date.parse(startdt) / 1000;
  let endtm = Date.parse(enddt) / 1000;
  console.log(starttm, endtm);
  apidbmgmt.getTokenTransferInByAccountAndMonth(address, starttm, endtm);
}
}
