import { ScanAPI } from "../../scanapi.mjs";
const apiMgmt = new ScanAPI();
import { UserService } from "../users/user.service.mjs";
import { timeRange } from "../../util.mjs";
import "../../utils.mjs";

export class MyAPI {
  // Create and Save a new Note
  gasFeeReport = async (req, res) => {
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let para = req.body.params;
    para.address = para.address.toLowerCase();
    let msg = await apiMgmt.getGasFeeReport(para);
    const json = {
      code: 10000,
      message: "success",
      data: msg,
    };
    res.send(json);
  };

  // Find a single note with a noteId
  interactiveReport = async (req, res) => {
    if (!req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let para = req.body.params;
    para.address = para.address.toLowerCase();
    if (req.body.params.year != undefined && req.body.params.year) {
      let tm = timeRange(req.body.params.year);
      Object.assign(para, tm);
    }
    let msg = await apiMgmt.getInteractiveReport(para);

    const json = {
      code: 10000,
      message: "success",
      data: msg,
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
    if (req.body.params.year != undefined && req.body.params.year) {
      let tm = timeRange(req.body.params.year);
      Object.assign(para, tm);
    }
    para.address = para.address.toLowerCase();
    let msg = await apiMgmt.getAssetReport(para);

    const json = {
      code: 10000,
      message: "success",
      data: msg,
    };
    res.send(json);
  };

  // Find a single note with a noteId
  addContractInfo = async (req, res) => {
    let para = req.body.params;
    if (req.body.params.name == undefined || !req.body.params.name) {
      return res.status(400).send({
        message: "name can not be empty",
      });
    }
    if (req.body.params.addresses == undefined || !req.body.params.addresses) {
      return res.status(400).send({
        message: "addresses can not be empty",
      });
    }

    para.addresses = para.addresses.map((x) => x.toLowerCase());
    let msg = await apiMgmt.addContractInfo(para);
    msg = msg == undefined || msg == null || msg == {} ? "success" : msg;
    const json = {
      code: 10000,
      message: msg,
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
    para.address = para.address.toLowerCase();
    let msg = await apiMgmt.addTokenPriceSource(para);
    msg = msg == undefined || msg == null || msg == {} ? "success" : msg;
    const json = {
      code: 10000,
      message: msg,
    };
    res.send(json);
  };
}
