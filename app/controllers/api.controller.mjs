import { ScanAPI } from "../../scanapi.mjs";
const apiMgmt = new ScanAPI();
import { UserService } from "../users/user.service.mjs";
const userService = new UserService();
const paused = process.env.PAUSED;
import { timeRange } from "../../util.mjs";
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
    console.log("json===========", json);
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
      let tm = await timeRange(req.body.params.year);
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
