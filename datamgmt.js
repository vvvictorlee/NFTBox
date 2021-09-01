const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV, writeCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);

const datapath = process.env.DATA_PATH || "/jsons/"

const badgedetail = datapath + "badgedetail.json";
const nftmetadata = datapath + "nftmetadata.json";
class DataMgmt {
    _badgedetail = null;

    async saveBadgeDetail(address, detailInfo) {
        this._badgedetail = getJSON(badgedetail)

        this._badgedetail[address] = detailInfo

        putJSON(badgedetail, this._badgedetail)

    }

    async getBadgeDetail(address) {
        this._badgedetail = getJSON(badgedetail)

        let b = Object.keys(this._badgedetail).filter(v => v.toLowerCase() == address.toLowerCase());
        if (b.length == 0) {
            return 0;
        }

        return this._badgedetail[b[0]];
    }

    async getNFTMetaData(tokenName) {
        let s = getJSON(nftmetadata)
        return s[tokenName];
    }
}

async function test() {
    let datamgmt = new DataMgmt()
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

module.exports = DataMgmt