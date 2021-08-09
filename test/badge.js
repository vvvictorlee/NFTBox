const { chai, server, should } = require("./testConfig");
const BadgeModel = require("../models/BadgeModel");
const IPModel = require("../models/IPModel");
const SybilModel = require("../models/SybilModel");
const ScanModel = require("../models/ScanModel");
const DBMgmt = require("../dbmgmt");
const dbMgmt = new DBMgmt();
/**
 * Test cases to test all the badge APIs
 * Covered Routes:
 * (1) Login
 * (2) Store badge
 * (3) Get all badges
 * (4) Get single badge
 * (5) Update badge
 * (6) Delete badge
 */

describe("Badge", () => {
    //Before each test we empty the database
    before((done) => {
        BadgeModel.deleteMany({}, (err) => {
        });
        IPModel.deleteMany({}, (err) => {
        });
        SybilModel.deleteMany({}, (err) => {
        });
        ScanModel.deleteMany({}, (err) => {
            done();
        });
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

    describe("badge", () => {
        it("it should do save badge for badge", async () => {
            await dbMgmt.saveBadgeDetail(testData.address, testData.tokenID)
            let tokenid = await dbMgmt.getBadgeDetail(testData.address)
            tokenid.should.equal(testData.tokenID)
            let totalsupply = await dbMgmt.getTotalSupply()
            totalsupply.should.equal(1)
        });
    });

    describe("ip", () => {
        it("it should do save ip for ip", async () => {
            await dbMgmt.saveIP(testIPData.ip)
            let ip = await dbMgmt.getIP(testIPData.ip)
            ip.should.equal(1)
        });
    });

    describe("sybil", () => {
        it("it should do save sybil for sybil", async () => {
            await dbMgmt.saveSybilAddress(testSybilData.address)
            let address = await dbMgmt.getSybilAddress(testSybilData.address)
            address.should.equal(1)
        });
    });

    describe("scan", () => {
        it("it should do save scan for scan", async () => {
            await dbMgmt.saveLatestScanBlock(testScanData.blockNumber)
            let block = await dbMgmt.getLatestScanBlock()
            block.should.equal(testScanData.blockNumber)
        });
    });
    // 	/*
    //   * Test the /POST route
    //   */
    // 	describe("/POST Login", () => {
    // 		it("it should do user Login for badge", (done) => {
    // 			chai.request(server)
    // 				.post("/api/auth/login")
    // 				.send({"email": userTestData.email,"password": userTestData.password})
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Login Success.");
    // 					userTestData.token = res.body.data.token;
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /POST route
    //   */
    // 	describe("/POST Badge Store", () => {
    // 		it("It should send validation error for store badge", (done) => {
    // 			chai.request(server)
    // 				.post("/api/badge")
    // 				.send()
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(400);
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /POST route
    //   */
    // 	describe("/POST Badge Store", () => {
    // 		it("It should store badge", (done) => {
    // 			chai.request(server)
    // 				.post("/api/badge")
    // 				.send(testData)
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Badge add Success.");
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /GET route
    //   */
    // 	describe("/GET All badge", () => {
    // 		it("it should GET all the badges", (done) => {
    // 			chai.request(server)
    // 				.get("/api/badge")
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Operation success");
    // 					testData._id = res.body.data[0]._id;
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /GET/:id route
    //   */
    // 	describe("/GET/:id badge", () => {
    // 		it("it should GET the badges", (done) => {
    // 			chai.request(server)
    // 				.get("/api/badge/"+testData._id)
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Operation success");
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /PUT/:id route
    //   */
    // 	describe("/PUT/:id badge", () => {
    // 		it("it should PUT the badges", (done) => {
    // 			chai.request(server)
    // 				.put("/api/badge/"+testData._id)
    // 				.send(testData)
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Badge update Success.");
    // 					done();
    // 				});
    // 		});
    // 	});

    // 	/*
    //   * Test the /DELETE/:id route
    //   */
    // 	describe("/DELETE/:id badge", () => {
    // 		it("it should DELETE the badges", (done) => {
    // 			chai.request(server)
    // 				.delete("/api/badge/"+testData._id)
    // 				.set("Authorization", "Bearer "+ userTestData.token)
    // 				.end((err, res) => {
    // 					res.should.have.status(200);
    // 					res.body.should.have.property("message").eql("Badge delete Success.");
    // 					done();
    // 				});
    // 		});
    // 	});
});