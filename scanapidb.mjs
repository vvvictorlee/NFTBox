import Tx from "./models/TxModel.mjs";
import TokenTx from "./models/TokenTxModel.mjs";
import BlockLogs from "./models/BlockLogsModel.mjs";
import EventSignature from "./models/EventSignatureModel.mjs";
import Contract from "./models/ContractModel.mjs";
import ContractInfo from "./models/ContractInfoModel.mjs";
import AccountAddress from "./models/AccountAddressModel.mjs";
import mongoose from "mongoose";
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

export class APIDBMgmt {
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
  async saveContractInfo(contractinfo) {
    ContractInfo.insertMany(contractinfo);
  }
  async saveAccountAddress(accounts) {
    AccountAddress.insertMany(accounts);
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
    console.log(s);
    return s;
  }

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
    console.log(s);
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
    console.log(s);
    return s;
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
    console.log(s);
    return s;
  }

  async getEarliestAndLatestTxByAccount(address) {
    let el = await this.getEarliestAndLatestTxHashByAccount(address);
    console.log(el);
    if (el.is_empty()) {
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
    console.log(s);
    return s;
  }

  async getTxCountByAccount(address) {
    let s = await Tx.find({
      from: address,
    }).count();
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
