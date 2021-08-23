
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

const { sendSignedTx,transferHoo } = require("./txmgmt.js");

const DataMgmt = require("./datamgmt.js");
const datamgmt = new DataMgmt()
const PreDataMgmt = require("./predatamgmt.js");
const predatamgmt = new PreDataMgmt()
const ActionMgmt = require('./actionmgmt.js');
const actionMgmt = new ActionMgmt();
const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);


const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);



let contracts = [];
let contractobjs = {};

const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const validators = secrets;//Object.keys(secrets);
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let abi = {};
let contract = {};
let proxy = validators[0];
let mindexOfProxy = 0;
let mvalidators = validators.slice(1);

instanceContract();
const scan_interval = process.env.SCAN_INTERVAL || 30
const lower_bound = web3.utils.toWei(process.env.LOWER_BOUND || "1")
const upper_bound = web3.utils.toWei(process.env.UPPER_BOUND || "2")
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

    async nativeBalanceOf(address) {
        const balance = await web3.eth.getBalance(address)
        return web3.utils.fromWei(balance);
    }

    async checkBalance2(address) {
        let balance = 0
        try {
            balance = await web3.eth.getBalance(address)
        } catch (error) {
            console.error(error)
        }
        if (web3.utils.fromWei(balance) >= 10) {
            let b = await web3.eth.getCode(address)

            console.error("check if is contract=", "0x" != b, "  >10 HOO checkBalance2==", address, web3.utils.fromWei(balance), balance)
        }
        if (web3.utils.fromWei(balance) >= 23) {
            let b = await web3.eth.getCode(address)

            console.error("check if is contract=", "0x" != b, "  checkBalance2==", address, web3.utils.fromWei(balance), balance)
            return true;
        }

        // console.log(address, web3.utils.fromWei(balance), balance)

        return false;
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
    async premint() {
        const addresses = await predatamgmt.premint()
        var d1 = new Date().getTime();

        for (let a of addresses) {
            console.log(a)
            let [result, msg] = await actionMgmt.claimBadge(a.toLowerCase(), "1.1.1.1");
            console.log(result, msg)
        }
        var d2 = new Date().getTime();
        console.log("premint elapse time" + (d2 - d1));
    }
    async airdrop() {
        const addresses = await predatamgmt.airdrops()
        var d1 = new Date().getTime();
        console.log("airdrop====",addresses.length)
        console.log("airdrop===data=")
        for (let a of addresses) {
            console.log("airdrop==begin==",a)
            let [result, msg] = await actionMgmt.claimBadge(a.toLowerCase(), "2.2.2.2",true);
            console.log("airdrop==end==",result, msg)
            await sleep(3000);
        }
        var d2 = new Date().getTime();
        console.log("airdrop  elapse time" + (d2 - d1));
    }
    async scanTransactions(startBlockNumber, endBlockNumber) {
        var d1 = new Date().getTime();
        const BLOCKS = 1200;
        if (endBlockNumber == null) {
            endBlockNumber = await web3.eth.getBlockNumber();
            console.log("Using endBlockNumber: " + endBlockNumber);
        }
        if (startBlockNumber == null) {
            startBlockNumber = endBlockNumber - BLOCKS;
            console.log("Using startBlockNumber: " + startBlockNumber);
        }
        console.log("Searching for transactions within blocks " + startBlockNumber + " and " + endBlockNumber);

        for (var i = startBlockNumber; i <= endBlockNumber; i++) {
            if (i % 1000 == 0) {
                console.log("Searching block " + i);
            }
            var block = await web3.eth.getBlock(i, true);
            if (block == null || block.transactions == null) {
                // console.error("no block", block, block.transactions)
                continue
            }
            for (let e of block.transactions) {
                // console.log("  tx hash          : " + e.hash + "\n"
                //     + "   nonce           : " + e.nonce + "\n"
                //     + "   blockHash       : " + e.blockHash + "\n"
                //     + "   blockNumber     : " + e.blockNumber + "\n"
                //     + "   transactionIndex: " + e.transactionIndex + "\n"
                //     + "   from            : " + e.from + "\n"
                //     + "   to              : " + e.to + "\n"
                //     + "   value           : " + e.value + "\n"
                //     + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                //     + "   gasPrice        : " + e.gasPrice + "\n"
                //     + "   gas             : " + e.gas + "\n"
                //     + "   input           : " + e.input);
                
                if (Number(e.value) < Number(lower_bound) || Number(e.value) > Number(upper_bound)) {
                    // console.error("no (Number(e.value) < Number(lower_bound) || Number(e.value) > Number(upper_bound)", (Number(e.value), Number(lower_bound), Number(upper_bound)))
                    continue
                }
                let balance = await web3.eth.getBalance(e.from)
                if (Number(balance) > Number(lower_bound)) {
                    // console.error("no Number(balance) > Number(lower_bound)", Number(balance), Number(lower_bound))
                    continue
                }
                console.log("sybil attack address ", e.from, "==to==", e.to);
                await datamgmt.saveSybilAddress(e.to, e.blockNumber);
            }
        }
        await datamgmt.saveLatestScanBlock(endBlockNumber);
        var d2 = new Date().getTime();
        console.log("scanTransactions elapse time" + (d2 - d1));
    }
  

}
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
// 函数实现，参数单位 毫秒 ；
function sleep(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};


let handlers = {
    "scantx": (async function () {
        console.log("==scantx==");
        let preactionmgmt = new PreActionMgmt()
        let b = await datamgmt.getLatestScanBlock();
        while (true) {
            if (b > 0) {
                await preactionmgmt.scanTransactions(b);
            } else {
                await preactionmgmt.scanTransactions();
            }
            await sleep(scan_interval);
        }
    }),
    "r": (async function () {
        console.log("==getReceipt==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.getReceipt();
    }),
    "pm": (async function () {
        console.log("==premint==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.premint();
    }),
    "ad": (async function () {
        console.log("==airdrop==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.airdrop();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = PreActionMgmt