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

const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);

const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);

ABI_FILES = ABI_FILES.concat(new Array(CONTRACT_ADDRESS.length - 4).fill(ABI_FILES[ABI_FILES.length - 1]))


const NETWORK_ID = process.env.CHAIN_ID || 170;
const CHAIN_ID = process.env.CHAIN_ID || 170;
const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));


let id;


var Tx = require('ethereumjs-tx').Transaction;
const ethereumjs_common = require('ethereumjs-common').default;

async function sendSignedTx(account, account_secrets, encodedabi, contract_address, isTokenIdOption, msg_value) {
    var d1 = new Date().getTime();


    let isTokenId = isTokenIdOption || false
    let value = msg_value || 0
    let nonce = await web3.eth.getTransactionCount(account, "pending");
    var privateKey = Buffer.from(account_secrets, 'hex');

    const gasprice = await web3.eth.getGasPrice();

    var rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(3000000),
        from: account,
        to: contract_address,
        value: web3.utils.toHex(web3.utils.toWei(value.toString())),//'0x00',//
        data: encodedabi,
        chainId: web3.utils.toHex(170)
    }
    var common = ethereumjs_common.forCustomChain('ropsten', { networkId: web3.utils.toHex(NETWORK_ID), chainId: web3.utils.toHex(CHAIN_ID), name: 'geth' }, 'muirGlacier');
    var tx = new Tx(rawTx, { "common": common });

    tx.sign(privateKey);

    var serializedTx = tx.serialize();
    console.log("=====sendSignedTransaction===")
    let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(JSON.stringify(receipt))
    if (isTokenId) {
        id = receipt["logs"][0]["topics"][3];
        //console.log("=====id====", id, web3.utils.hexToNumber(id))
        // var d2 = new Date().getTime();
        // console.log("elapse time" + (d2 - d1));
        return id;
    }

    // var d2 = new Date().getTime();
    // console.log("elapse time" + (d2 - d1));

    // sleep.msleep(100)

    return receipt;
}
// sendSignedTx();

module.exports = { sendSignedTx}
