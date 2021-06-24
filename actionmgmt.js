
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
const { sendSignedTx } = require("./txmgmt.js");

const DataMgmt = require("./datamgmt.js");
const datamgmt = new DataMgmt()

const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
const _ABNORMAL_PRECISION = process.env.ABNORMAL_PRECISION || {}
const abnomalPrecision = JSON.parse(_ABNORMAL_PRECISION);

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
let proxy = validators[0];
instanceContract();
let id;
let result;

const toWeiByCustom = (v, i) => {
    if (i in abnomalPrecision) {
        return (Number(v) * Math.pow(10,Number(abnomalPrecision[i]))).toString();
    }

    return web3.utils.toWei(v.toString());
};

class ActionMgmt {
    async computeBoxAddress(tokenId) {
        const index = 1;
        result = await contracts[index].methods.computeAddress(erc721tokenaddress, tokenId).call({ from: proxy[0] });
        //console.log("box address==", result);
        return result
    }
    async createBox(userAddress) {
        const index = 0;
        let encodedabi = await contracts[index].methods.mint(userAddress).encodeABI();
        let id = await sendSignedTx(proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }
    async depositTokensFromContract(boxAddress, tokens) {
        const index = 2;
        const amounts = tokens.amounts.map((v,i) => web3.utils.toHex(toWeiByCustom(v.toString(),i)));
        const tamounts = tokens.amounts.map((v,i) =>(toWeiByCustom(v.toString(),i)));
        console.log(tamounts,"depositTokensFromContract===", tokens.ids, amounts, boxAddress)
        let encodedabi = await contracts[index].methods.depositERC20(
            tokens.ids,
            amounts,
            boxAddress).encodeABI();
        await sendSignedTx(proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index]);
    }

    async claimBox(userAddress) {
        userAddress = userAddress.toLowerCase();
        let flag = await datamgmt.checkUserTimes(userAddress);
        if (!flag) {
            return [-1, "The times must be greater than 0"];
        }
        const randomNumber = await datamgmt.getRandSeqValue();
        let [level, tokens] = await datamgmt.getBoxLevelAward(randomNumber);
        let tokenId = await this.createBox(userAddress);
        let boxAddress = await this.computeBoxAddress(tokenId);
        await datamgmt.saveBoxAddresses(userAddress, { "boxAddress": boxAddress, "level": level });
        await datamgmt.saveBoxDetail(boxAddress, { "tokenId": tokenId, "randomNumber": randomNumber });
        // await this.depositTokens(boxAddress, tokens);
        await this.depositTokensFromContract(boxAddress, tokens);
        let times = await datamgmt.updateUserTimes(userAddress);

        return [0, { "address": boxAddress, "last_times": times, "level": level }];
    }

    async openBox(boxAddress) {
        const flag = await datamgmt.checkOpenedBoxAddress(boxAddress)
        if (flag) {
            return [-1, "The box opened"]
        }

        const index = 1;
        let detail = await datamgmt.getBoxDetail(boxAddress);
        let [level, tokens] = await datamgmt.getBoxLevelAward(detail.randomNumber);
        let encodedabi = await contracts[index].methods.plunder(
            erc721tokenaddress,
            detail.tokenId,
            tokens.ids,
            [],
            []
        ).encodeABI();
        let receipt = await sendSignedTx(proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index]);
        if (receipt["status"] != undefined && receipt["status"]) {
            const boxinfo = await datamgmt.getBoxInfoJson(level);
            // //console.log(level,boxinfo)
            await datamgmt.saveOpenedBoxAddress(boxAddress);
            return [0, boxinfo];
        }

        return [-1, "failed"];
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

let handlers = {
    "p": (async function () {
const _TOTAL_AMOUNTS = process.env.TOTAL_AMOUNTS || []
const amounts = JSON.parse(_TOTAL_AMOUNTS);
        console.log(amounts);
        let hamounts = amounts.map((v, i) => web3.utils.toHex(toWeiByCustom(v, i)));
        // hamounts = amounts.map((v, i) => toWeiByCustom(v, i));
        console.log(hamounts);
    }),
    "default": (async function () {
    })
};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = ActionMgmt