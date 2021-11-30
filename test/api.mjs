import { chai, server, should }  from "./testConfig.mjs";

import {APIDBMgmt}  from "../scanapidb.mjs";
import { TokenAPI } from "./scantokenapi.mjs";
import { LogAPI } from "./scanlogapi.mjs";
const dbMgmt = new APIDBMgmt();
const scanApi = new ScanAPI();
const tokenApi = new TokenAPI();
const logApi = new LogAPI();
const testaddress = "0xc19d04e8fe2d28609866e80356c027924f23b1a5";

describe("api", () => {
    //Before each test we empty the database
    before((done) => {
            done();
    });

    // Prepare data for testing
    const testData = {
        "address": "0x18f02e21c9293a7c0972ea195a04757850882817",
        "tokenID": "0x0000000000000000000000000000000000000000000000000000000000000039"
    };

    const testIPData = {
        "ip": "1.2.3.4"
    };

    const testSybilData = {
        "address": "0x18f02e21c9293a7c0972ea195a04757850882817"
    };

    const testScanData = {
        "method": "scan",
        "blockNumber": 1
    };

    describe("api", () => {
        it("it should do save badge for badge", async () => {
                await    scanApi.testtxto(testaddress);
        });
    });

    describe("total", () => {
        it("total gased  by account", async () => {
             scanApi.testtxtotal(testaddress);
        });
    });

    describe("el", () => {
        it("it should do save sybil for sybil", async () => {
           scanApi.testel(testaddress);
        });
    });

    describe("scan", () => {
        it("it should do save scan for scan", async () => {
          scanApi.testtxcontract(testaddress);
        });
    });
     describe("badge", () => {
        it("it should do save badge for badge", async () => {
                   const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
        ////token  transfer to 
        tokenApi.testtokenin(testaddress);
        });
    });

    describe("ip", () => {
        it("total gased  by account", async () => {
                const testaddress = "0xea54eaf095d66c6bfca2845de895b2cad65f6716";
        ////token  transfer to  by month
        tokenApi.testtokeninm(testaddress, 2021);
        });
    });

  

  
});