const Web3 = require('web3');
var BigNumber = require('bignumber.js');

const fs = require('fs');
require('dotenv').config();
const debug = require("debug");
const { getJSON,putJSON } = require('./util');
const { sendSM } = require('./sns');
const formula = debug('formula');
// debug.enable("formula");
// // // debug.disable("formula");
// // // const trader = debug('trader');
// debug.enable("trader");
// debug.disable("trader");

// debug.enable("*");

// debug.enable('foo:*,-foo:bar');
// let namespaces = debug.disable();
// debug.enable(namespaces);


const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
const _CONTRACT_NAME = process.env.CONTRACT_NAME || []
const CONTRACT_NAME = JSON.parse(_CONTRACT_NAME);
const _ALERT_THRESHOLD = process.env.ALERT_THRESHOLD || []
const ALERT_THRESHOLD = JSON.parse(_ALERT_THRESHOLD);
const _ALERT_TYPE = process.env.ALERT_TYPE || []
const ALERT_TYPE = JSON.parse(_ALERT_TYPE);

const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);


let contracts = [];
let contractobjs = {};

const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let abi = {};
let contract = {};
instanceContract();
let id;
let result;
const scan_interval = process.env.SCAN_INTERVAL || 30
const latestTvl = "latesttvl.json";
class PreActionMgmt {

    async geTotalSupply(index) {
        return 10;
        const totalSupply = await contracts[index].methods.totalSupply().call({ from: CONTRACT_ADDRESS[index] });
        return totalSupply;
    }

    async check() {
        let json = getJSON(latestTvl)
        for (let i = 0; i < CONTRACT_ADDRESS.length; i++) {
            let b = await this.geTotalSupply(i);
            let ts = new BigNumber(b);
            if (ALERT_THRESHOLD[i] == undefined || ALERT_TYPE[i] == undefined || CONTRACT_NAME[i] == undefined){
                console.error("undefined ALERT_THRESHOLD or ALERT_TYPE or CONTRACT_NAME", CONTRACT_ADDRESS[i], ALERT_TYPE[i], ALERT_THRESHOLD[i],CONTRACT_NAME[i]);
                continue;
            }
            let latest = new BigNumber(json[CONTRACT_ADDRESS[i]] == undefined ? 0 : json[CONTRACT_ADDRESS[i]]);
            if (ALERT_TYPE[i] == 1 && ts < new BigNumber(ALERT_THRESHOLD[i]) || ALERT_TYPE[i] == 2 && ts < latest * new BigNumber(ALERT_THRESHOLD[i]) / new BigNumber(100)) {
                sendSM(CONTRACT_NAME[i] + " latest tvl:" + b);
            }
            json[CONTRACT_ADDRESS[i]]=b;
            console.log(b)
        }
        console.log(json)
        putJSON(latestTvl, json);
    }

}
// # 1==fixed amount 2==percent
// /Users/lisheng/mygit/vvvictorlee/nftdb/abi/ AnyswapV6ERC20.json
function instanceContract() {
    for (let i = 0; i < CONTRACT_ADDRESS.length; i++) {
        abi = require("./abi/" + ABI_FILES[0]);
        contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS[i]);
        // console.log(i, "CONTRACT_ADDRESS[i]==", CONTRACT_ADDRESS[i]);

        if (undefined == contract) {
            return;
        }
        contracts.push(contract)
        contractobjs[CONTRACT_ADDRESS[i]] = contract
    }
    // //console.log(Contract.methods)
}
// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

let handlers = {
    "scantx": (async function () {
        console.log("==scantx==");
        let preactionmgmt = new PreActionMgmt()

        while (true) {
            await preactionmgmt.check();
            await sleep(scan_interval);
        }
    }),

    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = PreActionMgmt