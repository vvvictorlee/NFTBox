import { ScanAPI } from "../../scanapi.mjs";
const apiMgmt = new ScanAPI();
import { UserService } from "../users/user.service.mjs";
const userService = new UserService();
const paused = process.env.PAUSED;

async function timerange(year) {
  let nextyear = Number(year) + 1;
  let startdt = new Date(year + "-01-01 00:00:00.000");
  let enddt = new Date(nextyear + "-01-01 00:00:00.000");
  let startdatetime = Date.parse(startdt) / 1000;
  let enddatetime = Date.parse(enddt) / 1000;
  return { startdatetime, enddatetime };
}
async function  printheaders(req){
    console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    console.log("x-forwarded-for = " + req.header("x-forwarded-for")); // 各阶段ip的CSV, 最左侧的是原始ip
    console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
    console.log("remoteAddress = " + req.connection.remoteAddress); // 未发生代理时，请求的ip
    console.log("socketremoteAddress = " + req.socket.remoteAddress); // 未发生代理时，请求的ip
    console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
    const referer = req.header("referer");
    console.log("=====referer=========", referer);
}
export class NFT {
  // Create and Save a new Note
  gasFeeReport = async (req, res) => {
 

    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let para = req.body.params;
    let msg = await apiMgmt.getGasFeeReport(para);

    const json = {
      code: 10000,
      message: "success",
      data: { tokenId: msg },
    };
    console.log("json===========",json)
    res.send(json);
  };

  // Find a single note with a noteId
  interactiveReport = async (req, res) => {
    //console.log(req.body)
    if (!req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let para = req.body.params;
    if (req.body.params.year != undefined && req.body.params.address) {
      let tm = await timerange(req.body.params.year);
      para = Object.extend(para, tm);
    }
    let msg = await apiMgmt.getInteractiveReport(para);

    const json = {
      code: 10000,
      message: "success",
      data: {
        tokenId: msg,
      },
    };
    res.send(json);
  };

  // Find a single note with a noteId
  assetReport = async (req, res) => {

    let para = req.body.params;
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    if (req.body.params.year != undefined && req.body.params.address) {
      let tm = await timerange(req.body.params.year);
      para = Object.extend(para, tm);
    }

    let msg = await apiMgmt.getAssetReport(para);

    const json = {
      code: 10000,
      message: "success",
      data: {
        flag: msg,
      },
    };
    res.send(json);
  };

  // Find a single note with a noteId
  addContractInfo = async (req, res) => {

    let para = req.body.params;
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    if (req.body.params.year != undefined && req.body.params.address) {
      let tm = await timerange(req.body.params.year);
      para = Object.extend(para, tm);
    }

    let msg = await apiMgmt.addContractInfo(para);

    const json = {
      code: 10000,
      message: "success",
      data: {
        flag: msg,
      },
    };
    res.send(json);
  };

  // Find a single note with a noteId
  addTokenPriceSource = async (req, res) => {
    let para = req.body.params;
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let msg = await apiMgmt.addTokenPriceSource(para);

    const json = {
      code: 10000,
      message: "success",
      data: {
        flag: msg,
      },
    };
    res.send(json);
  };
}
