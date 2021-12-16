import Tx from "./models/TxModel.mjs";
import TokenTx from "./models/TokenTxModel.mjs";
import BlockLogs from "./models/BlockLogsModel.mjs";
import EventSignature from "./models/EventSignatureModel.mjs";
import Contract from "./models/ContractModel.mjs";
import ContractInfo from "./models/ContractInfoModel.mjs";
import TokenContractInfo from "./models/TokenContractInfoModel.mjs";
import TokenPrice from "./models/TokenPriceModel.mjs";

import AccountAddress from "./models/AccountAddressModel.mjs";
import TxHashEventName from "./models/TxHashEventNameModel.mjs";
import mongoose from "mongoose";
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
import "./utils.mjs";
import debug from "debug";
const apidebug = new debug("api");
export class APIDBMgmt {
  async init() {
    // DB connection
    var MONGODB_URL = process.env.MONGODB_URL;
    mongoose
      .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Connected to %s", MONGODB_URL);

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
  async getContracts(addresses) {
   return  Contract.find({contractAddress: { $in: addresses }}).distinct("contractAddress");
  }
  async saveContractInfo(contractinfo) {
    ContractInfo.insertMany(contractinfo);
  }
  async saveAccountAddress(accounts) {
    AccountAddress.insertMany(accounts);
  }
  async getAccountAddresses(addresses) {
   return  AccountAddress.find({AccountAddress: { $in: addresses }}).distinct("AccountAddress");
  }
  async saveTokenContractInfo(contractinfo) {
    TokenContractInfo.insertMany(contractinfo);
  }

  async saveTxHashEventName(txHashEventName) {
    TxHashEventName.insertMany(txHashEventName);
  }

  async saveTokenPrice(addresses) {
    await TokenPrice.insertMany(addresses);
  }

  async deleteTokenPrice(addresses) {
    await TokenPrice.deleteMany({ contractAddress: { $in: addresses } });
  }

  async updateTokenPrice(address, price) {
    console.log("address==========", address);
    let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
    let res = await TokenContractInfo.updateMany(
      { contractAddress: address },
      { price: price, lastUpdateTime: now },
      { upsert: true }
    );
    console.log(res);
  }

  async updateTokenPriceSource(para) {
    let now = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
    await TokenContractInfo.updateMany(
      { contractAddress: para.address },
      {
        priceSource: para.source,
        lastUpdateTime: now,
      },
      { upsert: true }
    );
  }

  async getTokenContractInfo() {
    return await TokenContractInfo.find();
  }

  async getTxEventNameByAccount(address) {
    let s = await BlockLogs.aggregate([
      {
        $match: {
          address: address,
        },
      },
      {
        $project: {
          transactionHash: "$transactionHash",
          eventName: { $slice: ["$topics", 0, 1] },
        },
      },
      {
        $unwind: "$eventName",
      },
      {
        $lookup: {
          from: "eventsignatures",
          localField: "eventName",
          foreignField: "eventSignature",
          as: "methods",
        },
      },
      {
        $match: {
          methods: { $ne: [] },
        },
      },
      {
        $project: {
          transactionHash: "$transactionHash",
          eventName: "$methods.eventName",
        },
      },
      {
        $unwind: "$eventName",
      },
    ]);
    console.log("=======getTxEventNameByAccount==========", s, s.length);
    return s;
  }

  async getTxContractAddressesByAccount(address) {
    // const reg = new RegExp(address, "i"); //ignorecase{ $regex: reg }
    let s = await Tx.find({
      $and: [
        {
          from: address,
        },
        { contractAddress: { $ne: null } },
        { contractAddress: { $ne: "" } },
      ],
    }).distinct("contractAddress");

    console.log("=======getTxContractAddressesByAccount==========", s.length);
    return s;
  }

  async getTxToByAccount(address) {
    // const reg = new RegExp(address, "i"); //ignorecase{ $regex: reg }
    // let s = await Tx.find({ from: address }).distinct("to");
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $lookup: {
          from: "accountaddresses",
          localField: "to",
          foreignField: "accountAddress",
          as: "accounts",
        },
      },
      { $match: { accounts: [] } },
      {
        $lookup: {
          from: "contractaddresses",
          localField: "to",
          foreignField: "contractAddress",
          as: "contracts",
        },
      },
      { $match: { contracts: [] } },
      {
        $group: {
          _id: "$to",
        },
      },
    ]);
    console.log("=======getTxToByAccount==========", s.length);
    return s;
  }

  async getTopTxCount() {
    const topcount = 50;

    let totxcount = await Tx.aggregate([
      {
        $lookup: {
          from: "accountaddresses",
          localField: "to",
          foreignField: "accountAddress",
          as: "accounts",
        },
      },
      { $match: { accounts: [] } },
      {
        $lookup: {
          from: "contractaddresses",
          localField: "to",
          foreignField: "contractAddress",
          as: "contracts",
        },
      },
      { $match: { contracts: [] } },
      {
        $group: {
          _id: "$to",
          times: {
            $count: {},
          },
        },
      },
      { $match: { times: { $gt: topcount } } },
    ]);
    const toarr = totxcount.map((x) => x._id);
    let fromtxcount = await Tx.aggregate([
      {
        $lookup: {
          from: "accountaddresses",
          localField: "to",
          foreignField: "accountAddress",
          as: "accounts",
        },
      },
      { $match: { accounts: [] } },
      {
        $lookup: {
          from: "contractaddresses",
          localField: "to",
          foreignField: "contractAddress",
          as: "contracts",
        },
      },
      { $match: { contracts: [] } },
      {
        $group: {
          _id: "$from",
          times: {
            $count: {},
          },
        },
      },
      { $match: { times: { $gt: topcount } } },
    ]);
    const fromarr = fromtxcount.map((x) => x._id);
    let contracttxcount = await Tx.aggregate([
      {
        $match: {
          $and: [
            { contractAddress: { $ne: null } },
            { contractAddress: { $ne: "" } },
          ],
        },
      },
      {
        $lookup: {
          from: "contractaddresses",
          localField: "contractAddress",
          foreignField: "contractAddress",
          as: "contracts",
        },
      },
      { $match: { contracts: [] } },
      {
        $group: {
          _id: "$contractAddress",
          times: {
            $count: {},
          },
        },
      },
      { $match: { times: { $gt: topcount } } },
    ]);
    const contractarr = contracttxcount.map((x) => x._id);

    //console.log(s);
    return [...toarr, ...fromarr, ...contractarr];
  }

  async getLatestBlockByAccount(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$from",
          latest: {
            $max: { $toDouble: "$blockNumber" },
          },
        },
      },
    ]);
    console.log(__line, __function, s);
    let blocknumber = 0;
    const blocknumbers = s;
    if (
      blocknumbers != undefined &&
      blocknumbers != null &&
      !blocknumbers.length == 0
    ) {
      blocknumber = blocknumbers[0].latest;
    }

    return blocknumber > 0 ? blocknumber + 1 : 0;
  }

  async getLatestBlockByAccountFromTokenTx(address) {
    let s = await TokenTx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$from",
          latest: {
            $max: { $toDouble: "$blockNumber" },
          },
        },
      },
    ]);
    console.log(__line, __function, s);
    let blocknumber = 0;
    const blocknumbers = s;
    if (
      blocknumbers != undefined &&
      blocknumbers != null &&
      !blocknumbers.length == 0
    ) {
      blocknumber = blocknumbers[0].latest;
    }

    return blocknumber > 0 ? blocknumber + 1 : 0;
  }

  ////// gas fee report
  async getTxGasedTotalByAccount(address) {
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
    // //console.log(s);
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
    //console.log(s);
    return s;
  }

  async getTxGasedTotalByAccountAndApp(address) {
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
      {
        $lookup: {
          from: "contractinfos",
          localField: "_id",
          foreignField: "contractAddress",
          as: "apps",
        },
      },
      {
        $project: {
          gased: "$gased",
          apps: "$apps",
          name: { $cond: [{ $ne: ["$apps", []] }, "$apps.appName", "other"] },
        },
      },
      {
        $group: {
          _id: "$name",
          gased: {
            $sum: "$gased",
          },
        },
      },
    ]);
    // //console.log(s);
    return s;
  }

  async getTxGasedTotalByAccountAndMethod(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $lookup: {
          from: "txhasheventname",
          localField: "transactionHash",
          foreignField: "transactionHash",
          as: "txevents",
        },
      },
      {
        $project: {
          gasPrice: { $toDouble: "$gasPrice" },
          gasUsed: { $toDouble: "$gasUsed" },
          gased: "$gased",
          txevents: "$txevents",
          eventNameorHash: {
            $cond: [{ $ne: ["$txevents", []] }, "$txevents.eventName", "other"],
          },
        },
      },
      {
        $group: {
          _id: "$eventNameorHash",
          gased: {
            $sum: {
              $multiply: ["$gasPrice", "$gasUsed", 0.000000000000000001],
            },
          },
        },
      },
    ]);
    // //console.log(s);
    return s;
  }

  ////// interactive report
  async getTxCountByAccount(address, year) {
    let s = await Tx.find({
      from: address,
    }).countDocuments();
    //console.log(s);
    return s;
  }

  async getTxCountByAccountAndContract(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$to",
          times: {
            $count: {},
          },
        },
      },
    ]);
    //console.log(s);
    return s;
  }

  async getTxCountByAccountAndApp(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$to",
          times: {
            $count: {},
          },
        },
      },
      {
        $lookup: {
          from: "contractinfos",
          localField: "_id",
          foreignField: "contractAddress",
          as: "apps",
        },
      },
      {
        $project: {
          times: "$times",
          name: { $cond: [{ $ne: ["$apps", []] }, "$apps.appName", "other"] },
        },
      },
      {
        $group: {
          _id: "$name",
          times: {
            $sum: "$times",
          },
        },
      },
    ]);

    return s;
  }

  async getEarliestAndLatestTxByAccount(address) {
    let el = await this.getEarliestAndLatestTxHashByAccount(address);
    console.log(el);
    if (el.length == 0) {
      return [];
    }
    let filter = {
      $and: [
        {
          from: address,
        },
        {
          $or: [
            { timeStamp: el[0].earlist + "" },
            {
              timeStamp: el[0].latest + "",
            },
          ],
        },
      ],
    };
    console.log(JSON.stringify(filter));
    let s = await Tx.find(filter);
    //console.log(s);
    return s;
  }

  async getEarliestAndLatestTxHashByAccount(address) {
    let s = await Tx.aggregate([
      {
        $match: {
          from: address,
        },
      },
      {
        $group: {
          _id: "$from",
          earlist: {
            $min: { $toDouble: "$timeStamp" },
          },
          latest: {
            $max: { $toDouble: "$timeStamp" },
          },
        },
      },
    ]);
    //console.log(s);
    return s;
  }

  // {
  // $match: {
  //     apps: { $ne: [] },
  // },
  // },
  async getTxCountSpanByAccountAndMonth(para) {
    // console.log(__line, __function, para);
    const address = para.address;
    const startdatetime = para.startdatetime;
    const enddatetime = para.enddatetime;
    const range = para.range;

    let s = await Tx.aggregate([
      {
        $project: {
          to: "$to",
          from: "$from",
          timespan: {
            $mod: [
              {
                $hour: {
                  $toDate: {
                    $multiply: [
                      { $add: [{ $toDouble: "$timeStamp" }, 28800] },
                      1000,
                    ],
                  },
                },
              },
              { $toDouble: range },
            ],
          },
          timeStamp: { $toDouble: "$timeStamp" },
        },
      },
      {
        $match: {
          $and: [
            {
              from: address,
            },
            { timeStamp: { $gte: startdatetime, $lt: enddatetime } },
          ],
        },
      },
      {
        $group: {
          _id: "$timespan",
          times: {
            $count: {},
          },
        },
      },
    ]);
    console.log(s);
    return s;
  }

  ///// asset report
  async getTokenTransferInByAccount(para) {
    const address = para.address;
    const startdatetime = para.startdatetime;
    const enddatetime = para.enddatetime;

    let s = await TokenTx.aggregate([
      {
        $match: {
          $and: [
            {
              to: address,
            },
            { timeStamp: { $gte: startdatetime, $lt: enddatetime } },
          ],
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
          amountvalue: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $project: {
          amount: { $toString: "$amount" },
          amountvalue: { $toString: "$amountvalue" },
          contractAddress: "$_id",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
        },
      },
    ]);
    //console.log(s);
    return s;
  }

  async getTokenTransferInAmountPriceByAccount(para) {
    const address = para.address;
    const startdatetime = para.startdatetime;
    const enddatetime = para.enddatetime;
    let s = await TokenTx.aggregate([
      {
        $match: {
          $and: [
            {
              to: address,
            },
            { timeStamp: { $gte: startdatetime, $lt: enddatetime } },
          ],
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
          amountvalue: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $project: {
          amount: { $toString: "$amount" },
          amountvalue: { $toString: "$amountvalue" },
          contractAddress: "$_id",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
        },
      },
      {
        $lookup: {
          from: "tokencontractinfos",
          localField: "contractAddress",
          foreignField: "contractAddress",
          as: "tokenprices",
        },
      },
      {
        $project: {
          pricea: {
            $cond: [{ $ne: ["$tokenprices", []] }, "$tokenprices.price", [0]],
          },
        },
      },
      {
        $unwind: "$pricea",
      },
      {
        $project: {
          amount: "$amount",
          price: "$pricea",
        },
      },
      {
        $project: {
          amount: {
            $multiply: [{ $toDouble: "$price" }, { $toDouble: "$amount" }],
          },
        },
      },
      {
        $group: { _id: null, amount: { $sum: "$amount" } },
      },
    ]);
    // console.log(JSON.stringify(s));
    //console.log(s);
    return s;
  }

  async getTokenTransferInByAccountAndMonth(para) {
    const address = para.address;
    const startdatetime = para.startdatetime;
    const enddatetime = para.enddatetime;
    let s = await TokenTx.aggregate([
      {
        $project: {
          to: "$to",
          value: "$value",
          contractAddress: "$contractAddress",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
          month: {
            $month: {
              $toDate: {
                $multiply: [
                  { $add: [{ $toDouble: "$timeStamp" }, 28800] },
                  1000,
                ],
              },
            },
          },
          timeStamp: { $toDouble: "$timeStamp" },
        },
      },
      {
        $match: {
          $and: [
            {
              to: address,
            },
            { timeStamp: { $gte: startdatetime, $lt: enddatetime } },
          ],
        },
      },
      {
        $group: {
          _id: ["$contractAddress", "$month"],
          tokenName: { $last: "$tokenName" },
          tokenSymbol: { $last: "$tokenSymbol" },
          tokenDecimal: { $last: "$tokenDecimal" },
          month: {
            $min: "$month",
          },
          amount: {
            $sum: {
              $divide: [
                { $toDecimal: "$value" },
                { $toDecimal: { $pow: [10, { $toDouble: "$tokenDecimal" }] } },
              ],
            },
          },
          amountvalue: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $project: {
          amount: { $toString: "$amount" },
          amountvalue: { $toString: "$amountvalue" },
          contractAddress: "$contractAddress",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
          month: "$month",
        },
      },
    ]);
    //console.log(s);
    return s;
  }
  //   {
  //     $match: {
  //       tokenprices: { $ne: [] },
  //     },
  //   },
  async getTokenTransferInAmountPriceByAccountAndMonth(para) {
    const address = para.address;
    const startdatetime = para.startdatetime;
    const enddatetime = para.enddatetime;
    let s = await TokenTx.aggregate([
      {
        $project: {
          to: "$to",
          value: "$value",
          contractAddress: "$contractAddress",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
          month: {
            $month: {
              $toDate: {
                $multiply: [
                  { $add: [{ $toDouble: "$timeStamp" }, 28800] },
                  1000,
                ],
              },
            },
          },
          timeStamp: { $toDouble: "$timeStamp" },
        },
      },
      {
        $match: {
          $and: [
            {
              to: address,
            },
            { timeStamp: { $gte: startdatetime, $lt: enddatetime } },
          ],
        },
      },
      {
        $group: {
          _id: ["$contractAddress", "$month"],
          tokenName: { $last: "$tokenName" },
          tokenSymbol: { $last: "$tokenSymbol" },
          tokenDecimal: { $last: "$tokenDecimal" },
          month: {
            $min: "$month",
          },
          amount: {
            $sum: {
              $divide: [
                { $toDecimal: "$value" },
                { $toDecimal: { $pow: [10, { $toDouble: "$tokenDecimal" }] } },
              ],
            },
          },
          amountvalue: {
            $sum: {
              $toDecimal: "$value",
            },
          },
        },
      },
      {
        $project: {
          amount: { $toString: "$amount" },
          amountvalue: { $toString: "$amountvalue" },
          contractAddress: "$_id",
          tokenName: "$tokenName",
          tokenSymbol: "$tokenSymbol",
          tokenDecimal: "$tokenDecimal",
          month: "$month",
        },
      },
      {
        $lookup: {
          from: "tokencontractinfos",
          localField: "contractAddress",
          foreignField: "contractAddress",
          as: "tokenprices",
        },
      },
      {
        $project: {
          month: "$month",
          amount: "$amount",
          pricea: {
            $cond: [{ $ne: ["$tokenprices", []] }, "$tokenprices.price", [0]],
          },
        },
      },
      {
        $unwind: "$pricea",
      },
      {
        $project: {
          month: "$month",
          amount: "$amount",
          price: "$pricea",
        },
      },
      {
        $project: {
          month: "$month",
          amount: {
            $multiply: [{ $toDouble: "$price" }, { $toDouble: "$amount" }],
          },
        },
      },
      {
        $group: { _id: "$month", amount: { $sum: "$amount" } },
      },
    ]);
    //console.log(s);
    return s;
  }
}
