const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV,readUCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);

const datapath = process.env.DATA_PATH || "/jsons/"
const users = datapath + "users.json";

const randomsequence = datapath + "randomsequence.json";
const boxlevels = datapath + "boxlevels.json";
const boxlevelinfo = datapath + "boxlevelinfo.json";
class PreDataMgmt {
    _users = null;
    _boxaddresses = null;
    _boxdetail = null;
    _randSeq = null;
    _boxlevels = null;
    _boxlevelinfo = null;
    _openedboxes = null;
   
    async genrandseq() {
       
        var originalArray = new Array;//原数组 
        //给原数组originalArray赋值 
        for (var i = 0; i < count; i++) {
            originalArray[i] = i + 1;
        }
        var d1 = new Date().getTime();
        originalArray.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < count; i++) {
            //console.log(originalArray[i] + " , ");
        }
        var d2 = new Date().getTime();
        //console.log("运算耗时" + (d2 - d1));
        putJSON(randomsequence, originalArray)
    }

    async genrandseqx() {
        var count = 80;
        var originalArray = new Array;//原数组 
        //给原数组originalArray赋值 
        for (var i = 0; i < count; i++) {
            originalArray[i] = i + 15000 + 1;
        }
        var d1 = new Date().getTime();
        originalArray.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < count; i++) {
            console.log(" , " + originalArray[i]);
        }
        var d2 = new Date().getTime();
        //console.log("运算耗时" + (d2 - d1));
    }

    async genBoxInfoJson() {
        const col = names.length;
        let json = [];
        for (var i = 0; i < amounts.length; i++) {
            let obj = {};
            let tokens = [];
            obj["level"] = i + 1;
            tokens = [];
            for (let j = 0; j < col; j++) {
                let token = {};
                token["name"] = names[j];
                token["symbol"] = symbols[j];
                token["amount"] = amounts[i][j];
                tokens.push(token);
            }
            obj["tokens"] = tokens;
            json.push(obj)
        }

        putJSON(boxlevelinfo, json)
    }

    async genBoxLevelJson() {
        const upperbounds = [300, 900, 2000, 5000, 15000];
        const addresses = CONTRACT_ADDRESS.slice(3)
         let json = [];
        for (var i = 0; i < upperbounds.length; i++) {
            let obj = {};
            let tokens = [];
            obj["upperbound"] = upperbounds[i];
            let token = {};
            token["ids"] = addresses;
            token["amounts"] = amounts[i];
            obj["tokens"] = token;
            json.push(obj)
        }

        putJSON(boxlevels, json)
    }

    async readUserFromCsv() {
        const csvfile = "/jsons/mainnetdata/" + "top10000.csv";
        const json = readCSVToJSON(csvfile)
        putJSON(users, json)
    }
    async premint() {
        let addresses = readUCSV("/csvs/h.csv")
        return addresses;
    }
    async airdrops() {
        let addresses = readUCSV("/csvs/airdrops2.csv")
        return addresses;
    }
}

async function test() {
    let datamgmt = new PreDataMgmt()
    let user = 1;
    let tokenId = 2;
    let r;
}

        let datamgmt = new PreDataMgmt()
let handlers = {
    "t": (async function () {
        test();
    }),
    "genrandseq": (async function () {
        console.log("==genrandseq==");

        await datamgmt.genrandseq();
    }),
    "genrandseqx": (async function () {
        console.log("==genrandseqx==");
        await datamgmt.genrandseqx();
    }),
    "genlevel": (async function () {
        console.log("==genlevel==");
        
        await datamgmt.genBoxLevelJson();
        await datamgmt.genBoxInfoJson();
    }),
    "readcsv": (async function () {
        console.log("==readcsv==");
        
        await datamgmt.readUserFromCsv();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

module.exports = PreDataMgmt