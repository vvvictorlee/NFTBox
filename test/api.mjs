import { chai, server, should } from "./testConfig.mjs";

import { APIDBMgmt } from "../scanapidb.mjs";
import { ScanAPI } from "../scanapi.mjs";
import { TokenAPI } from "../scantokenapi.mjs";
import { LogAPI } from "../scanlogapi.mjs";
const apiDBMgmt = new APIDBMgmt();
const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";
const toaddress = "0x26ee42a4de70cebcde40795853eba4e492a9547f";
const tokenaddress = "0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b";
import { timeRange } from "../util.mjs";

describe("api", () => {
  //Before each test we empty the database
  before(async () => {
  });

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

    it("getTxCountSpanByAccountAndMonth", async () => {
      const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
      ////token  transfer to
      await apiDBMgmt.getTxCountSpanByAccountAndMonth(testaddress);
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
    it("updateTokenPriceSource", async () => {
      ////token  transfer to  by month
      await apiDBMgmt.updateTokenPriceSource({
        address: testaddress,
        source: "url",
      });
    });
  });

  describe("/POST gas fee report", () => {
    it.only("gas fee report", async () => {
      let res = await chai
        .request(server)
        .post("/api/gasfeereport")
        .send({
          jsonrpc: "2.0",
          id: "id",
          method: "gasfeereport",
          params: {
            address: "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
            ip: "1.2.3.4",
          },
        });
      console.log("======================", res.body);
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
            address: "0xc19D04E8Fe2d28609866e80356c027924F23B1A5",
            ip: "1.2.3.4",
          },
        });
      console.log("======================", res);
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
            address: "0xc19D04E8Fe2d28609866e80356c027924F23B1A5",
            ip: "1.2.3.4",
          },
        });
      console.log("======================", res);
    });
  });
});
