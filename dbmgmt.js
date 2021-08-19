const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV, writeCSV } = require('./util');


const datapath = process.env.DATA_PATH || "/jsons/"


const Badge = require("./models/BadgeModel");
const IP = require("./models/IPModel");
const Scan = require("./models/ScanModel");
const Sybil = require("./models/SybilModel");
const TokenId = require("./models/TokenIdModel");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set('useCreateIndex', true) //加上这个

class DBMgmt {
    _badgedetail = null;
    _ip = null;
    async saveBadgeDetail(address, detailInfo) {
        var badge = new Badge(
            {
                address: address,
                tokenID: detailInfo
            });

        await badge.save();
    }

    async getBadgeDetail(address) {
        let badge = await Badge.findOne({ address: address }, "tokenID")
        if (badge != null) {
            return badge.tokenID;
        }

        return 0;
    }

    async saveTokenId(id, address) {
        var tokenId = new TokenId(
            {
                tokenID: id,
                address: address
            });

        await tokenId.save();
    }

    async getTokenId(id) {
        let tokenId = await TokenId.findOne({ tokenID: id }, "address")
        if (tokenId != null) {
            return tokenId.address;
        }

        return 0;
    }

    async getTotalSupply() {
        let count = await Badge.find().countDocuments();
        return count;
    }

    async saveIP(ip) {
        var ips = new IP(
            {
                ip: ip
            });

        await ips.save();

    }

    async getIP(ip) {
        let ips = await IP.findOne({ ip: ip }, "ip")
        if (ips != null) {
            return 1;
        }

        return 0;
    }


    async saveSybilAddress(address) {
        var sybils = new Sybil(
            {
                address: address
            });

        await sybils.save();
    }

    async getSybilAddress(address) {
        let sybils = await Sybil.findOne({ address: address }, "address")
        if (sybils != null) {
            return 1;
        }

        return 0;
    }

    async saveLatestScanBlock(block) {
        let scan = await Scan.findOne({ method: "scan" }, "blockNumber")
        if (scan != null) {
            scan.blockNumber = block
        }
        else {
            scan = new Scan(
                {
                    method: "scan",
                    blockNumber: block
                });
        }

        await scan.save();

    }

    async getLatestScanBlock() {
        let scan = await Scan.findOne({ method: "scan" }, "blockNumber")
        if (scan != null) {
            return scan.blockNumber;
        }

        return 0;
    }

}

async function test() {
    let datamgmt = new DBMgmt()
    let user = 1;
    let tokenId = 2;
    let r;

}



let handlers = {
    "t": (async function () {
        test();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

module.exports = DBMgmt