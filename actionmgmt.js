
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
const DataMgmt = require("./datamgmt.js");
const datamgmt = new DataMgmt()
// const readJson = (fileName) => {
//     return JSON.parse(fs.readFileSync(fileName));
// }
// const secrets = readJson('._');

// const dodo_names = (process.env.DODO_NAMES || "").split(",") || []
const secrets_pairs = process.env.SECRETS || []
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
// const CONTRACT_ADDRESS = ["0x989418e99E3B29A81906fb9998AEfa74EAae2539", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8",
//     "0x8970F39632E01C59e4d104AbDD53FB39779aad67", "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
//     "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a",
//     "0x93c0cEb6d5e77439A6A33A4cd75F28a965706209"
// ];

const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);
// const ABI_FILES = ["ERC721Controlled.json", "LootBoxController.json",
//     "ERC20Mintable.json", "ERC20Mintable.json", "ERC20Mintable.json",
//     "ERC20Mintable.json", "ERC20Mintable.json"];

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
// const BN = require('BigNumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

let abi = {};
let contract = {};
let candidate = validators[1][0];
let user = validators[1];
let proxy = validators[2];
instanceContract();
// instanceERC721Contract();
let id;
let erc721;
let result;
class ActionMgmt {
    async computeBoxAddress(tokenId) {
        const index = 1;
        result = await contracts[index].methods.computeAddress(erc721tokenaddress, tokenId).call({ from: proxy[0] });
        //console.log("box address==", result);
        return result
    }
    async getReceipt() {
        var receipt = await web3.eth.getTransactionReceipt('0x92e079aaeda3f8b54b5c0e836a5a650b7ca9d13903b547de0993eb87cbe3ddf3');
        console.log(receipt);
    }
    async createERC721Controlled() {
        //console.log(candidate)
        let encodedabi = await erc721contract.methods.createERC721Controlled("HOO Smart Chain NFTBox", "HSCBOX", "https://nfts.hoosmartchain.com/hscbox/").encodeABI();
        await sendSignedTx(proxy[0], proxy[1], encodedabi, ERC721_CONTRACT_ADDRESS, true);
    }

    // 0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e
    //1
    async createBox(userAddress) {
        const index = 0;
        //console.log(userAddress)
        let encodedabi = await contracts[index].methods.mint(userAddress).encodeABI();
        let id = await sendSignedTx(proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }

    async depositTokens(boxAddress, tokens) {
        const index = 0;
        for (let i = 0; i < tokens.ids.length; i++) {
            ////console.log(boxAddress, tokens.amounts[i],web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))
            let encodedabi = await contractobjs[tokens.ids[i]].methods.transfer(boxAddress, web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString()))).encodeABI();
            await sendSignedTx(proxy[0], proxy[1], encodedabi, tokens.ids[i]);
        }
    }

    async checkBalance(address) {
        const balance = await web3.eth.getBalance(address)
        // console.log(web3.utils.fromWei(balance),balance)
        if (web3.utils.fromWei(balance) < 0.1) {
            return false
        }

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

    async depositTokensFromContract(boxAddress, tokens) {
        const index = 2;
        const amounts = tokens.amounts.map((v) => web3.utils.toHex(web3.utils.toWei(v.toString())));
        // console.log(tokens.ids,amounts,boxAddress)
        let encodedabi = await contracts[index].methods.depositERC20(
            tokens.ids,
            amounts,
            boxAddress).encodeABI();
        await sendSignedTx(proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index]);
    }

    async claimBox(userAddress) {
        let flag = await this.checkBalance(userAddress);
        if (!flag) {
            return [-1, "The balance must be greater than 0.1"];
        }
        flag = await datamgmt.checkUserTimes(userAddress);
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

let actionMgmt = new ActionMgmt()
// actionMgmt.claimBox(candidate);
const ba = "0xD0874c0ccf6A320A25147bbc02Af67733efFC236";
// actionMgmt.openBox(ba);


var Tx = require('ethereumjs-tx').Transaction;
const ethereumjs_common = require('ethereumjs-common').default;

async function sendSignedTx(account, account_secrets, encodedabi, contract_address, isTokenIdOption, msg_value) {
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
    JSON.stringify(receipt);
    console.log(JSON.stringify(receipt))
    if (isTokenId) {
        id = receipt["logs"][0]["topics"][3];
        //console.log("=====id====", id, web3.utils.hexToNumber(id))
        return id;
    }

    return receipt;
}
// sendSignedTx();

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

function instanceERC721Contract() {
    abi = require("./abi/" + ERC721_ABI_FILE).abi;
    erc721contract = new web3.eth.Contract(abi, ERC721_CONTRACT_ADDRESS);
    if (undefined == erc721contract) {
        console.log("un");
        return;
    }
    //console.log(erc721contract.methods)
}

let handlers = {
    "c": (async function () {
        console.log("==createERC721Controlled==");
        let actionmgmt = new ActionMgmt()
        await actionmgmt.createERC721Controlled();
    }),
    "r": (async function () {
        console.log("==getReceipt==");
        let actionmgmt = new ActionMgmt()
        await actionmgmt.getReceipt();
    }),
    "d": (async function () {
        console.log("==depositTokensToContract==");
        let actionmgmt = new ActionMgmt()
        const tokens = await datamgmt.getTotalAmounts();
        await actionmgmt.depositTokensToContract(tokens);
    }),
    "m": (async function () {
        console.log("==mintTokensToContract==");
        let actionmgmt = new ActionMgmt()
        const tokens = await datamgmt.getTotalAmounts();
        await actionmgmt.mintTokensToContract(tokens);
    }),
    "b": (async function () {
        console.log("==balanceOf==");
        let actionmgmt = new ActionMgmt()
        const tokens = await datamgmt.getTotalAmounts();
        await actionmgmt.balanceOf(tokens, "0x1753783e46a6a7B3d345A92c5265c178f94367cf");
    }),
    "bc": (async function () {
        console.log("==balanceOf contract==");
        let actionmgmt = new ActionMgmt()
        const tokens = await datamgmt.getTotalAmounts();
        await actionmgmt.balanceOf(tokens, CONTRACT_ADDRESS[2]);
    }),
    "tm": (async function () {
        console.log("==transferTokensToContractFromMainNet==");
        let actionmgmt = new ActionMgmt()
        const tokens = await datamgmt.getTotalAmounts();
        await actionmgmt.transferTokensToContractFromMainNet(tokens, user);
    }),

    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = ActionMgmt