
const Web3 = require('web3');

const fs = require('fs');
require('dotenv').config();
const debug = require("debug");
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

class PreActionMgmt {
    
    async geTotalSupply() {
        const index = 0;
            // console.log( contracts[index].methods);

        const totalSupply = await contracts[index].methods.totalSupply().call({from:CONTRACT_ADDRESS[0]});
        return totalSupply;
    }
    
}
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
            let b = await preactionmgmt.geTotalSupply();
            console.log(b)
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