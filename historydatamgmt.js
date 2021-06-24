const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV, writeCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);

const _NAMES = process.env.NAMES || []
const names = JSON.parse(_NAMES);

const _SYMBOLS = process.env.SYMBOLS || []
const symbols = JSON.parse(_SYMBOLS);

const _AMOUNTS = process.env.AMOUNTS || []
const amounts = JSON.parse(_AMOUNTS);


const datapath = process.env.DATA_PATH || "/jsons/"
const users = datapath + "users.json";
const boxaddresses = datapath + "boxaddresses.json";
const boxdetail = datapath + "boxdetail.json";
const randomsequence = datapath + "randomsequence.json";
const currentindex = datapath + "currentindex.json";
const boxlevels = datapath + "boxlevels.json";
const boxlevelinfo = datapath + "boxlevelinfo.json";
const openedboxes = datapath + "openedboxes.json";
class HistoryDataMgmt {
    _users = null;
    _boxaddresses = null;
    _boxdetail = null;
    _randSeq = null;
    _boxlevels = null;
    _boxlevelinfo = null;
    _openedboxes = null;

    async checkUserTimesWrong() {
        let boxaddrs = getJSON("jsons/mainnetdata06080642/boxaddresses.json")
        let users = getJSON("jsons/mainnetdata0607/users.json")
        let users8 = getJSON("jsons/mainnetdata06080642/users.json")
        let userso = getJSON("jsons/mainnet/users.json")

        let s = Object.keys(boxaddrs).filter(v => Number(boxaddrs[v].length) > Number(userso[v]))
        console.log("s length==", s.length)
        s.map(u => console.log(u, "=", users[u], "=", users8[u], "=", userso[u], "=", boxaddrs[u].length))
        let t = s.reduce((acc, u) => acc += boxaddrs[u].length - userso[u], 0)
        console.log("t==", t)
    }

    async getBoxLevel(randomNumber) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }
        let i = 0;
        for (i = 0; i < this._boxlevels.length; ++i) {
            if (Number(randomNumber) <= Number(this._boxlevels[i].upperbound)) {
                return i + 1;
            }
        }
        return 0;
    }

    async checkRand() {
        let r = getJSON("jsons/mainnetdata0609/r.json")
        let r2 = getJSON("jsons/mainnetdata0609/randomsequence.json")
        let count = 0;
        let levels = {};
        let levels2 = {};
        for (let i = 1; i <= 5; i++) {
            levels[i] = 0
            levels2[i] = 0
        }
        for (let i = 0; i < r.length; i++) {
            if (r[i] > 15000) {
                console.error("=================", r[i])
            }
            if (r[i] != r2[i]) {
                count++
                let l = await this.getBoxLevel(r[i])
                let l2 = await this.getBoxLevel(r2[i])
                levels[l]++
                levels2[l2]++
                console.log(l, "=", r[i], "=", r2[i], "=", r2[i], "=", l2)
            }
        }

        console.log("count==", count, "levels==", levels, "levels2==", levels2)
    }

    async checkUserNumberOne(addr) {
        let boxaddrs = getJSON("jsons/mainnetdata0610/boxaddresses.json")
        let openedboxes = getJSON("jsons/mainnetdata0610/openedboxes.json")
        let _users = getJSON("jsons/mainnetdata0610/users.json")
        const one = "0x607fe8Ce38097A3e71acBE1FD814bbb0D65C46c3";
        const inone = "0x607fe8Ce38097A3e71acBE1FD814bbb0D65c46c3";

        let b = Object.keys(_users).filter(v => v.toLowerCase() == inone.toLowerCase());
        if (b.length > 0) {
            addr = b[0];
        }
        console.log("b", b, "addr", addr);
        let s = boxaddrs[one].filter(v => openedboxes.indexOf(v.boxAddress) == -1)
        console.log(boxaddrs[one].length, "unopenboxes length==", s.length)
        let oneamounts = new Array(amounts[0].length).fill(0);
        let levelcounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (let u of boxaddrs[one]) {
            // console.log("u.level==",u, u.level)
            levelcounts[u.level]++;
        }

        console.log("levelcounts==", levelcounts)
        console.log("oneamounts==", oneamounts)
        for (let l of Object.keys(levelcounts)) {
            // console.log("l==", l)
            let levelamounts = await this.getLevelAwardAmounts(l - 1)
            for (let i = 0; i < levelamounts.length; i++) {
                oneamounts[i] = Number(oneamounts[i]) + Number(levelamounts[i]) * Number(levelcounts[l]);
            }
        }

        const addresses = CONTRACT_ADDRESS.slice(3)
        console.log("names==", names)
        console.log("symbols==", symbols)
        console.log("addresses==", addresses)
        console.log("oneamounts==", oneamounts)
    }

    async getLevelAwardAmounts(level) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }

        return this._boxlevels[level].tokens.amounts;
    }


    async addAddresses() {
        let addresses = readCSV("/jsons/mainnetdata/12.csv")
        console.log("========addresses=========", addresses)
        let emails = getJSON("/jsons/mainnetdata/wrongaddresses.json")
        console.log("=========emails========", emails)
        let s = {};
        addresses.map(u => { if (u[0] != undefined && u[0].length > 0) { s[u[0]] = emails[u[1]]; } })
        console.log("s==", s)
    }

    async unclaimAddresses() {
        let addresses12 = readCSV("/jsons/mainnetdata/12.csv")
        const csvfile = "/jsons/mainnetdata/" + "top10000.csv";
        let addresses = readCSV(csvfile)
        let claimedaddresses = getJSON("/jsons/mainnetdata0615/boxaddresses.json")
        let c = Object.keys(claimedaddresses)
        let a = addresses.filter(u => c.indexOf(u[0]) != -1).map(u => u[2]);
        let b = addresses12.filter(u => c.indexOf(u[0]) != -1).map(u => u[1]);
        let s = a.concat(b);
        putJSON("/jsons/mainnetdata0615/unclaimedaddresses.json", s)
        const allcsvfile = "/jsons/mainnetdata/" + "alltop10000.csv";
        let alladdresses = readCSV(allcsvfile);
        let ss = alladdresses.filter(u => s.indexOf(u[1]) == -1);
        writeCSV("/jsons/mainnetdata0615/unclaimedaddresses.csv", ss)
        // console.log("s==", ss)
    }

}

async function test() {
    let user = 1;
    let tokenId = 2;
    let r;
}

let datamgmt = new HistoryDataMgmt()

let handlers = {
    "t": (async function () {
        test();
    }),
    "wrong": (async function () {
        console.log("==checkUserTimesWrong==");

        await datamgmt.checkUserTimesWrong();
    }),
    "rand": (async function () {
        console.log("==checkRand==");

        await datamgmt.checkRand();
    }),
    "one": (async function () {
        console.log("==checkUserNumberOne==");

        await datamgmt.checkUserNumberOne();
    }),
    "add": (async function () {
        console.log("==addAddresses==");

        await datamgmt.addAddresses();
    }),
    "unc": (async function () {
        console.log("==unclaimAddresses==");

        await datamgmt.unclaimAddresses();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

module.exports = HistoryDataMgmt