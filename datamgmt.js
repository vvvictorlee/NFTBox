const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV,writeCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);


const datapath = process.env.DATA_PATH || "/jsons/"

const badgedetail = datapath + "badgedetail.json";

const ips = datapath + "ips.json";
const sybil = datapath + "sybil.json";

class DataMgmt {
      _badgedetail = null;
     _ip = null;
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


    async getTotalSupply() {
        this._badgedetail = getJSON(badgedetail)
        return Object.keys(this._badgedetail).length ;
   
    }

    async saveIP(ip) {
        this._ip = getJSON(ips)

        this._ip[ip] = ""

        putJSON(ips, this._ip)

    }

    async getIP(ip) {
        this._ip = getJSON(ips)

        let b = Object.keys(this._ip).filter(v => v.toLowerCase() == ip.toLowerCase());
        if (b.length == 0) {
            return 0;
        }

        return 1;
    }


    async saveSybilAddress(address) {
        this._sybil = getJSON(sybil)

        this._sybil[address] = ""

        putJSON(sybil, this._sybil)

    }

    async getSybilAddress(address) {
        this._sybil = getJSON(sybil)

        let b = Object.keys(this._sybil).filter(v => v.toLowerCase() == address.toLowerCase());
        if (b.length == 0) {
            return 0;
        }

        return 1;
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