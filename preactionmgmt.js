
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

const DataMgmt = require("./datamgmt.js");
const datamgmt = new DataMgmt()

const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);


const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);

ABI_FILES = ABI_FILES.concat(new Array(CONTRACT_ADDRESS.length - 4).fill(ABI_FILES[ABI_FILES.length - 1]))


const ERC721_ABI_FILE = "ERC721ControlledFactory.json"
let ERC721_CONTRACT_ADDRESS = "0x71725cb45adc6Fb2962B407EB3824F13030c5430";
let erc721contract;
let contracts = [];
let contractobjs = {};
const NETWORK_ID = process.env.CHAIN_ID || 170;
const CHAIN_ID = process.env.CHAIN_ID || 170;
const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const validators = secrets;//Object.keys(secrets);
const erc721tokenaddress = CONTRACT_ADDRESS[0]
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let abi = {};
let contract = {};
let candidate = validators[1][0];
let user = validators[1];
let proxy = validators[2];
instanceContract();
let id;
let result;
class PreActionMgmt {
    async depositTokens(boxAddress, tokens) {
        for (let i = 0; i < tokens.ids.length; i++) {
            ////console.log(boxAddress, tokens.amounts[i],web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))
            let encodedabi = await contractobjs[tokens.ids[i]].methods.transfer(boxAddress, web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString()))).encodeABI();
            await sendSignedTx(proxy[0], proxy[1], encodedabi, tokens.ids[i]);
        }
    }

    async checkBalance(address) {
        const balance = await web3.eth.getBalance(address)
        if (web3.utils.fromWei(balance) < 0.1) {
            console.error("checkBalance==", address, web3.utils.fromWei(balance), balance)
            return false;
        }

        // console.log(address, web3.utils.fromWei(balance), balance)

        return true;
    }

    async balanceOf(tokens, address) {
        const index = 2;
        for (let i = 0; i < tokens.ids.length; i++) {
            let amount = await contractobjs[tokens.ids[i]].methods.balanceOf(address).call({ from: proxy[0] });
            console.log(tokens.ids[i], "====", web3.utils.fromWei(amount), "====", amount);
        }
    }

    async transferTokensToContractFromMainNet(tokens, user) {
        const index = 2;
        console.log(CONTRACT_ADDRESS[index])
        for (let i = 0; i < tokens.ids.length; i++) {
            let amount = await contractobjs[tokens.ids[i]].methods.balanceOf(user[0]).call({ from: user[0] });
            amount = web3.utils.fromWei(amount)
            console.log(user[0], amount, web3.utils.toHex(web3.utils.toWei(amount.toString())))
            let encodedabi = await contractobjs[tokens.ids[i]].methods.transfer(CONTRACT_ADDRESS[index], web3.utils.toHex(web3.utils.toWei(amount.toString()))).encodeABI();
            await sendSignedTx(user[0], user[1], encodedabi, tokens.ids[i]);
        }
    }

    async depositTokensToContract(tokens) {
        const index = 2;
        for (let i = 0; i < tokens.ids.length; i++) {
            ////console.log(boxAddress, tokens.amounts[i],web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))
            let encodedabi = await contractobjs[tokens.ids[i]].methods.transfer(CONTRACT_ADDRESS[index], web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString()))).encodeABI();
            await sendSignedTx(proxy[0], proxy[1], encodedabi, tokens.ids[i]);
        }
    }

    async mintTokensToContract(tokens) {
        const index = 2;
        console.log(CONTRACT_ADDRESS[index]);//,boxAddress, tokens.amounts[i],web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))

        for (let i = 0; i < tokens.ids.length; i++) {
            console.log(tokens.amounts[i], web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))

            let encodedabi = await contractobjs[tokens.ids[i]].methods.mint(CONTRACT_ADDRESS[index], web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString()))).encodeABI();
            await sendSignedTx(proxy[0], proxy[1], encodedabi, tokens.ids[i]);
        }
    }
}

let actionMgmt = new PreActionMgmt()

function instanceContract() {
    for (let i = 0; i < CONTRACT_ADDRESS.length; i++) {
        abi = require("./abi/" + ABI_FILES[i]).abi;
        contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS[i]);
        if (undefined == contract) {
            //console.log("un");
            return;
        }
        contracts.push(contract)
        contractobjs[CONTRACT_ADDRESS[i]] = contract
    }
    // //console.log(Contract.methods)
}

let handlers = {
    "r": (async function () {
        console.log("==getReceipt==");
        let actionmgmt = new PreActionMgmt()
        await actionmgmt.getReceipt();
    }),
    "d": (async function () {
        console.log("==depositTokensToContract==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.depositTokensToContract(tokens);
    }),
    "m": (async function () {
        console.log("==mintTokensToContract==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.mintTokensToContract(tokens);
    }),
    "nb": (async function () {
        console.log("==checkBalance==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.checkBalance("0xE427f4202c3d43Cf2A538E1a3ED5a34B63d07150");
        await actionmgmt.checkBalance("0x0e1855F9f2e2638cbd9d14e5baDad2baC022AF8d");
    }),
    "b": (async function () {
        console.log("==balanceOf==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.balanceOf(tokens, "0x1753783e46a6a7B3d345A92c5265c178f94367cf");
    }),
    "bc": (async function () {
        console.log("==balanceOf contract==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.balanceOf(tokens, CONTRACT_ADDRESS[2]);
    }),
    "tm": (async function () {
        console.log("==transferTokensToContractFromMainNet==");
        let actionmgmt = new PreActionMgmt()
        const tokens = await datamgmt.getTOTAL_AMOUNTS();
        await actionmgmt.transferTokensToContractFromMainNet(tokens, user);
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = PreActionMgmt