import path from "path";

import fs from "fs";
import { authorize } from "../_helpers/authorize.mjs";

import { MyAPI } from "../controllers/api.controller.mjs";
const nft = new MyAPI();
export default (app) => {
  app.post("/api/gasfeereport", async function (req, res, next) {
    await nft.gasFeeReport(req, res);
  });
  app.post("/api/interactivereport", async function (req, res, next) {
    await nft.interactiveReport(req, res);
  });
  app.post("/api/assetreport", async function (req, res, next) {
    await nft.assetReport(req, res);
  });
  app.post("/api/addcontractinfo", async function (req, res, next) {
    await nft.addContractInfo(req, res);
  });
  app.post("/api/addtokenpricesource", async function (req, res, next) {
    await nft.addTokenPriceSource(req, res);
  });
};
