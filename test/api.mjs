import { chai, server, should } from "./testConfig.mjs";

import { APIDBMgmt } from "../scanapidb.mjs";
import { ScanAPI } from "../scanapi.mjs";
import { TokenAPI } from "../scantokenapi.mjs";
import { LogAPI } from "../scanlogapi.mjs";
import { TimerAPI } from "../scantimerapi.mjs";
const apiDBMgmt = new APIDBMgmt();
const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const timerApi = new TimerAPI();
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";
const toaddress = "0x26ee42a4de70cebcde40795853eba4e492a9547f";
const tokenaddress = "0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b";
import { timeRange, readJSON } from "../util.mjs";
import "../utils.mjs";

describe("api", () => {
  //Before each test we empty the database
  before(async () => {});

  // Prepare data for testing
  const testData = {
    address: "0x18f02e21c9293a7c0972ea195a04757850882817",
    tokenID:
      "0x0000000000000000000000000000000000000000000000000000000000000039",
  };

  const testIPData = {
    ip: "1.2.3.4",
  };

  const testSybilData = {
    address: "0x18f02e21c9293a7c0972ea195a04757850882817",
  };

  const testScanData = {
    method: "scan",
    blockNumber: 1,
  };

  describe("api", () => {
    it("getTxGasedTotalByAccountAndContract", async () => {
      await apiDBMgmt.getTxGasedTotalByAccountAndContract(testaddress);
    });

    it("getTxGasedTotalByAccountAndApp", async () => {
      await apiDBMgmt.getTxGasedTotalByAccountAndApp(testaddress);
    });
    it("getTxCountByAccountAndContract", async () => {
      await apiDBMgmt.getTxCountByAccountAndContract(testaddress);
    });
    it("getTxCountByAccountAndApp", async () => {
      await apiDBMgmt.getTxCountByAccountAndApp(testaddress);
    });
    it("getTokenTransferInByAccount", async () => {
      await apiDBMgmt.getTokenTransferInByAccount(toaddress);
    });
    it("getTokenTransferInAmountPriceByAccount", async () => {
      await apiDBMgmt.getTokenTransferInAmountPriceByAccount(toaddress);
    });
    it("getTokenTransferInByAccountAndMonth", async () => {
      let para = timeRange(2021);
      para.address = toaddress;
      await apiDBMgmt.getTokenTransferInByAccountAndMonth(para);
    });

    it("getTokenTransferInAmountPriceByAccountAndMonth", async () => {
      let para = timeRange(2021);
      para.address = toaddress;
      await apiDBMgmt.getTokenTransferInAmountPriceByAccountAndMonth(para);
    });

    it("getTopTxCount", async () => {
      const address = await apiDBMgmt.getTopTxCount();
      console.log(address);
    });

    it("getTxCountSpanByAccountAndMonth", async () => {
      ////token  transfer to
      const para = {
        address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
        year: "2021",
        startdatetime: 1619844892,
        enddatetime: 1638955412,
        range: "6",
      };
      await apiDBMgmt.getTxCountSpanByAccountAndMonth(para);
    });
    it("saveTokenPrice ", async () => {
      ////token  transfer to
      await apiDBMgmt.saveTokenPrice([
        {
          contractAddress: "symaddress[xx[0].trim()]",
          price: "x.price.trim()",
          lastUpdateTime: "now",
        },
      ]);
    });
    it("saveEventSignature ", async () => {
      ////token  transfer to
      await apiDBMgmt.saveEventSignature([
        { eventName: "fAdminChanged", eventSignature: "0x7e644d79" },
        { eventName: "fBeaconUpgraded", eventSignature: "0x1cf3b03a" },
        { eventName: "fUpgraded", eventSignature: "0xbc7cd75a" },
      ]);
    });
    it("getTxEventNameByAccount", async () => {
      ////token  transfer to
      //   const para = {
      //     address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
      //     year: "2021",
      //     startdatetime: 1619844892,
      //     enddatetime: 1638955412,
      //     range: "6",
      //   };
      const address = "0xd4d41ec4d4d3b775b43a82cb5b0c61e0f114ab1d";
      await apiDBMgmt.getTxEventNameByAccount(address);
    });
    it("syncBlockLogsByContractAddress", async () => {
      const address = "0xd4d41ec4d4d3b775b43a82cb5b0c61e0f114ab1d";
      const testtokenaddress = "0x6e250De4635f2A87c2CF092Dafd500787a6942b2";

      let res = await logApi.getEventNameFromAbiByContract(testtokenaddress);
      res = await logApi.getEventNameFromAbiByContract(address);

      if (res != undefined && res != null && res > 0) {
        const flag = await logApi.syncBlockLogsByContractAddress(address);
        if (flag != 0) {
          let events = await apiDBMgmt.getTxEventNameByAccount(address);
          await apiDBMgmt.saveTxHashEventName(events);
        }
      }
    });
    it("getTxGasedTotalByAccountAndMethod", async () => {
      const address = "0xc13018a528e4498ee6fa28d0f519a034972ad1e8";
      await scanApi.syncOnChainData(address);
      const s = await apiDBMgmt.getTxGasedTotalByAccountAndMethod(address);

      console.log(s);
    });
    it("getTxContractAddressesByAccount", async () => {
      const address = "0xc13018a528e4498ee6fa28d0f519a034972ad1e8";
      const s = await apiDBMgmt.getTxContractAddressesByAccount(address);

      console.log(s);
    });
    it("saveContractInfo ", async () => {
      ////token  transfer to
      //   await apiDBMgmt.saveTokenContractInfo([
      //     { contractAddress: testaddress, price: "4.4" }
      //   ]);
      await apiDBMgmt.saveContractInfo([
        {
          contractAddress: "0x1cd14602425efead850db5b2ecb6f6fb9059e7b6",
          appName: "appname",
        },
        {
          contractAddress: "0xff714022dcf8cf20c22a8396b635152a95185621",
          appName: "appname",
        },
        {
          contractAddress: "0xcc627e99236b4919d2b4986fac52a0e86dbad973",
          appName: "appname",
        },
        {
          contractAddress: "0x01484d31ed350dc8b52a40a6215c3bbb88dbe0ab",
          appName: "appname",
        },
        {
          contractAddress: "0x345458f902e9c61adfc1153eb27e14458b8ae65f",
          appName: "appname",
        },
        {
          contractAddress: "0x8e5427ed6c48c9f3cf4da406ed46254a602a144e",
          appName: "appname",
        },
      ]);
    });
    it("updateTokenPrice ", async () => {
      ////token  transfer to
      await apiDBMgmt.updateTokenPrice(tokenaddress, "0.0207");
    });
    it.only("updateTokegetContractsnPrice ", async () => {
      ////token  transfer to
      const addresses = [];
      const s = await apiDBMgmt.getContracts(addresses);
      console.log(s);
    });
    it("updateTokenPriceSource", async () => {
      ////token  transfer to  by month
      await apiDBMgmt.updateTokenPriceSource({
        address: testaddress,
        source: "url",
      });
    });

    it("parsePriceInfo", async () => {
      const json = readJSON("./jsons/prices.json");
      await timerApi.parsePriceInfo(json);
    });
    it("parsePriceInfoFromSwap", async () => {
      const json = readJSON("./jsons/swapprices.json");
      await timerApi.parsePriceInfoFromSwap(json);
    });

    it("fetchPriceFromHooEx", async () => {
      await timerApi.fetchPriceFromHooEx();
    });

    it("fetchPriceFromSwap", async () => {
      await timerApi.fetchPriceFromSwap();
    });
  });

  describe("/POST gas fee report", () => {
    it("gas fee report", async () => {
      let res = await chai
        .request(server)
        .post("/api/gasfeereport")
        .send({
          jsonrpc: "2.0",
          id: "id",
          method: "gasfeereport",
          params: {
            address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
          },
        });
      console.log("=========res.body=============", JSON.stringify(res.body));
    });
  });
  describe("/POST interactive report", () => {
    it("interactive report", async () => {
      let res = await chai
        .request(server)
        .post("/api/interactivereport")
        .send({
          jsonrpc: "2.0",
          id: "id",
          method: "interactivereport",
          params: {
            address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
            year: 2021,
            range: 6,
          },
        });
      console.log("=========res.body=============", JSON.stringify(res.body));
    });
  });

  describe("/POST asset report", () => {
    it("asset report", async () => {
      let res = await chai
        .request(server)
        .post("/api/assetreport")
        .send({
          jsonrpc: "2.0",
          id: "id",
          method: "assetreport",
          params: {
            address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
            year: 2021,
          },
        });
      console.log("=========res.body=============", JSON.stringify(res.body));
    });
  });
});
