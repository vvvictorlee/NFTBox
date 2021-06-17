
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

const {sendSignedTx} = require("./txmgmt.js");


// const dodo_names = (process.env.DODO_NAMES || "").split(",") || []
const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);

const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);



const ERC721_ABI_FILE = "ERC721ControlledFactory.json"
let ERC721_CONTRACT_ADDRESS = "0xf8aB84C0A07F1B4F46DE9d98dCca48CC1517cbf2";
let erc721contract;

const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const validators = secrets;//Object.keys(secrets);
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

let abi = {};
let user = validators[1];
let proxy = validators[0];
instanceERC721Contract();

class FactoryMgmt {
    async getReceipt() {
        var receipt = await web3.eth.getTransactionReceipt('0x92e079aaeda3f8b54b5c0e836a5a650b7ca9d13903b547de0993eb87cbe3ddf3');
        console.log(receipt);
    }
    async createERC721Controlled() {
        //console.log(candidate)
        let encodedabi = await erc721contract.methods.createERC721Controlled("HOO 3rd Anniversary", "HOOBADGE", "https://badge.hoosmartchain.com/badge/").encodeABI();
        await sendSignedTx(proxy[0], proxy[1], encodedabi, ERC721_CONTRACT_ADDRESS, true);
    }
}


function instanceERC721Contract() {
    abi = require("./abi/" + ERC721_ABI_FILE).abi;
    erc721contract = new web3.eth.Contract(abi, ERC721_CONTRACT_ADDRESS);
    if (undefined == erc721contract) {
        console.log("un");
        return;
    }
    //console.log(erc721contract.methods)
}

let factoryMgmt = new FactoryMgmt()

let handlers = {
    "c": (async function () {
        console.log("==createERC721Controlled==");
        let actionmgmt = new FactoryMgmt()
        await actionmgmt.createERC721Controlled();
    }),
   
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = FactoryMgmt