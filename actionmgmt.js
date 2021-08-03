
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

const _TOTAL_SUPPLY = process.env.TOTAL_SUPPLY || 10000
const TOTAL_SUPPLY = JSON.parse(_TOTAL_SUPPLY);

const _ABI_FILES = process.env.ABI_FILES || []
let ABI_FILES = JSON.parse(_ABI_FILES);
const address_balance_limit = process.env.ADDRESS_BALANCE_LIMIT || 1


let contracts = [];
let contractobjs = {};

const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const validators = secrets;//Object.keys(secrets);
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let abi = {};
let contract = {};
let proxy = validators[0];
instanceContract();
const index = 0;
const AwaitLock = require('await-lock').default;
let  iii = 0;
class ActionMgmt {
    async createBadge(userAddress) {
        const index = 0;
        proxy = validators[++iii%validators.length];

        const gas = await contracts[index].methods.mint(userAddress).estimateGas({ from: proxy[0] });

        let encodedabi = await contracts[index].methods.mint(userAddress).encodeABI();
        let id = await sendSignedTx(gas,proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }

  async checkip(ip) {
        let  lock = new AwaitLock();
        await lock.acquireAsync();
        try {
            ip = ip.toLowerCase();
            let ipv = await datamgmt.getIP(ip);
            if (ipv != 0) {
                return true;
            }
            await datamgmt.saveIP(ip);
        } finally {
            lock.release();
        }
        return false;
     }
    async checkBalance(address) {
        const balance = await web3.eth.getBalance(address)
        if (web3.utils.fromWei(balance) < address_balance_limit) {
            console.error("checkBalance==", address, web3.utils.fromWei(balance), balance)
            return false;
        }

        // console.log(address, web3.utils.fromWei(balance), balance)

        return true;
    }
    async claimBadge(userAddress, ip) {
      let ab = await this.checkBalance(userAddress)
       if (!ab) {
                return [10004, "The address balance limit is 1 HOO  requested"];
            }

        let ipb = await this.checkip(ip)
       if (ipb) {
                console.error("The same ip once requested")
                return [10003, "The same ip once requested"];
            }
        let  lock = new AwaitLock();
        

        await lock.acquireAsync();
        try {
            userAddress = userAddress.toLowerCase();
            let tokenId = await datamgmt.getBadgeDetail(userAddress);
            if (tokenId != 0) {
                return [10001, "The address claimed"];
            }

            let totalSupply = await this.totalSupply();
            if (totalSupply >= TOTAL_SUPPLY) {
                return [10002, "The badge claimed finished"];
            }
            try{
            tokenId = await this.createBadge(userAddress);
            }catch(error){
                console.error(error)
                return [10001, "The address claimed reverted on chain"];
            }
            await datamgmt.saveBadgeDetail(userAddress, tokenId);
            tokenId = web3.utils.hexToNumber(tokenId)

            return [0, tokenId];
        } finally {
            lock.release();
        }
    }

    async isMaxTotalSupply() {
        let totalSupply = await datamgmt.getTotalSupply();// this.totalSupply();

        return !(Number(totalSupply) < Number(TOTAL_SUPPLY));
    }

    async getBadge(userAddress) {
        userAddress = userAddress.toLowerCase();
        let tokenId = await datamgmt.getBadgeDetail(userAddress);
        let totalSupply = await this.totalSupply();
        if (tokenId == 0 && totalSupply < TOTAL_SUPPLY) {
            return [10001, "no tokenid"];
        }

        let balance = await this.balanceOf(userAddress);
        if (balance == 0) {
            return [10002, "the token is transfered on the chain"];
        }

        let owner = await this.ownerOf(tokenId);
        if (owner.toLowerCase() != userAddress.toLowerCase()) {
            tokenId = await this.tokenOf(userAddress);
            if (tokenId == 0) {
                return [10003, "the token is changed on the chain"];
            }
        }
        tokenId = web3.utils.hexToNumber(tokenId)
        return [0, tokenId];
    }

    async balanceOf(address) {
        let amount = await contracts[index].methods.balanceOf(address).call({ from: proxy[0] });
        return amount;
    }

    async ownerOf(tokenId) {
        let amount = await contracts[index].methods.ownerOf(tokenId).call({ from: proxy[0] });
        return amount;
    }
    async tokenOf(address) {
        let tokenId = await contracts[index].methods.ownerOf(address).call({ from: proxy[0] });
        return tokenId;
    }
    async totalSupply() {
        let amount = await contracts[index].methods.totalSupply().call({ from: proxy[0] });
        return amount;
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
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = ActionMgmt