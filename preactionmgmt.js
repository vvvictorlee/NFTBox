
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

const { sendSignedTx, transferHoo } = require("./txmgmt.js");

const DataMgmt = require("./datamgmt.js");
const datamgmt = new DataMgmt()
const DBMgmt = require("./dbmgmt.js");
const dbmgmt = new DBMgmt()
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
let id;
let result;
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
        const index = 1;
        for (let i = 0; i < tokens.ids.length; i++) {
            let amount = await contractobjs[tokens.ids[i]].methods.balanceOf(address).call({ from: proxy[0] });
            console.log(tokens.ids[i], "====", web3.utils.fromWei(amount), "====", amount);
        }
    }

    async transferTokensToContractFromMainNet(tokens, user) {
        const index = 1;
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
        const index = 1;
        for (let i = 0; i < tokens.ids.length; i++) {
            ////console.log(boxAddress, tokens.amounts[i],web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString())))
            let encodedabi = await contractobjs[tokens.ids[i]].methods.transfer(CONTRACT_ADDRESS[index], web3.utils.toHex(web3.utils.toWei(tokens.amounts[i].toString()))).encodeABI();
            await sendSignedTx(proxy[0], proxy[1], encodedabi, tokens.ids[i]);
        }
    }

    async mintTokensToContract(tokens) {
        const index = 1;
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
        console.log("airdrop====", addresses.length)
        console.log("airdrop===data=")
        for (let a of addresses) {
            console.log("airdrop==begin==", a)
            let [result, msg] = await actionMgmt.claimBadge(a.toLowerCase(), "2.2.2.2", true);
            console.log("airdrop==end==", result, msg)
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
    async migrateToAddress(tokenIdRangeLower, len) {
        console.log(tokenIdRangeLower, "====tokenIdRangeLower====");

        const index = 0;
        mindexOfProxy = ++mindexOfProxy % mvalidators.length;
        proxy = mvalidators[mindexOfProxy];
        const addresses = await dbmgmt.getAdddressesBySkipLimit(tokenIdRangeLower, len)
        if (addresses.length == 0) {
            console.log(tokenIdRangeLower, "====addresses= is empty===", addresses, "========");
            return 0;
        }
        let gas = 0;
        let id = 0;
        // console.log(tokenIdRangeLower, "====addresses= ===", addresses, "========");

        try {

            gas = await contracts[index].methods.mintByTokenIds(addresses, tokenIdRangeLower).estimateGas({ from: proxy[0] });
            let encodedabi = await contracts[index].methods.mintByTokenIds(addresses, tokenIdRangeLower).encodeABI();
            id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);

        } catch (error) {
            console.error(tokenIdRangeLower, "====tokenIdRangeLower===");//,error)
            return -1;
        }
        return id;
    }
    async migrateToAddresses(tokenIdRangeLower, len, step) {
        for (let i = 0; i < len; i += step) {
            let id = await this.migrateToAddress(Number(tokenIdRangeLower) + Number(i), step);
            if (id == -1) {
                break;
            }
        }
    }

    async geTotalSupply() {
        const index = 0;
        proxy = validators[0];
        const totalSupply = await contracts[index].methods.totalSupply().call({ from: proxy[0] });

        return totalSupply;
    }
    async migrateFromAddress(tokenIdLower, len) {
        var d1 = new Date().getTime();

        for (let i = 0; i < len; ++i) {
            let tid = tokenIdLower + i
            let address = await this.geBadgeAddress(tid);
            if (address == "0x0000000000000000000000000000000000000000") {
                break;
            }
            if (i % 1000 == 0) {
                console.log(tid, address)
            }
            await dbmgmt.saveTokenId(tid, address);
        }
        var d2 = new Date().getTime();
        console.log("1000 elapse time" + (d2 - d1));
    }

    async geBadgeAddressv2(tokendId) {
        const index = 1;
        proxy = validators[0];
        // console.log("ownerOf(======", tokendId)

        let address = "0x0000000000000000000000000000000000000000";
        try {
            address = await contracts[index].methods.ownerOf(tokendId).call({ from: proxy[0] });
        } catch (error) {
            console.error("====geBadgeAddressv2==error=tokendId==", tokendId, "====")//,//error)
        }
        return address;
    }
    async migrateFromAddressv2(tokenIdLower, len) {
        console.log(tokenIdLower, len)

        var d1 = new Date().getTime();

        for (let i = 0; i < len; ++i) {
            let tid = Number(tokenIdLower) + Number(i)
            let address = await this.geBadgeAddressv2(tid);
            if (address == "0x0000000000000000000000000000000000000000") {
                console.log(tokenIdLower, ",tid==", tid, ",")
                // break;
            }
            if (i % 1000 == 0) {
                console.log(tid, address)
            }
            // await dbmgmt.saveTokenId(tid, address);
        }
        var d2 = new Date().getTime();
        console.log(tokenIdLower, "migrateFromAddressv2 elapse time" + (d2 - d1));
    }

    async geBadgeAddress(tokendId) {
        const index = 0;
        proxy = validators[0];
        const address = await contracts[index].methods.ownerOf(tokendId).call({ from: proxy[0] });

        return address;
    }

    async geBadgeAddressFromDest(tokendId) {
        const index = 1;
        proxy = validators[0];
        // console.log("ownerOf(======", tokendId)

        let address = "0x0000000000000000000000000000000000000000";
        try {
            address = await contracts[index].methods.ownerOf(tokendId).call({ from: proxy[0] });
        } catch (error) {
            console.error("=geBadgeAddressFromDest=tokendId==", tokendId, "====");//,error)
        }
        return address;
    }

    async migrateAddressCMP(tokenIdLower, len) {
        console.log(tokenIdLower, len)

        var d1 = new Date().getTime();

        for (let i = 0; i < len; ++i) {
            let tid = Number(tokenIdLower) + Number(i)
            let address = await this.geBadgeAddress(tid);
            if (address == "0x0000000000000000000000000000000000000000") {
                console.log(tokenIdLower, ",tid==", tid, ",")
                break;
            }
            let destAddress = await this.geBadgeAddressFromDest(tid);
            if (destAddress == "0x0000000000000000000000000000000000000000") {
                console.log(tokenIdLower, ",dest tid==", tid, ",")
                // break;
            }
            if (address != destAddress) {
                console.log(tokenIdLower, ",diff dest tid==", tid, ",address==", address, ",dest address==", destAddress)
                // break;
            }
            if (i % 1000 == 0) {
                console.log(tid, address)
            }
            // await dbmgmt.saveTokenId(tid, address);
        }
        var d2 = new Date().getTime();
        console.log(tokenIdLower, "migrateAddressCMP elapse time" + (d2 - d1));
    }

    async migrateToAddressFromContract(tokenIdRangeLower, len) {
        const index = 2;
        mindexOfProxy = ++mindexOfProxy % mvalidators.length;
        proxy = mvalidators[mindexOfProxy];
        let gas = 0;
        let id = 0;
        try {
            gas = await contracts[index].methods.mintByTokenIds(tokenIdRangeLower, len).estimateGas({ from: proxy[0] });

            let encodedabi = await contracts[index].methods.mintByTokenIds(tokenIdRangeLower, len).encodeABI();
            id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);

        } catch (error) {
            // console.error(tokenIdRangeLower, "====tokenIdRangeLower===");//,error)
            console.error(tokenIdRangeLower, "====tokenIdRangeLower===", error)

            return -1;
        }

        return id;
    }

    async migrateToAddressesFromContract(tokenIdRangeLower, len, step) {
        for (let i = 0; i < len; i += step) {
            console.log("==lower==", Number(tokenIdRangeLower) + Number(i), "==step==", step)
            let id = await this.migrateToAddressFromContract(Number(tokenIdRangeLower) + Number(i), step);
            if (id == -1) {
                // break;
            }
        }
    }

    async burnFromMDContract(len, address) {
        const index = 2;
        mindexOfProxy = ++mindexOfProxy % mvalidators.length;
        proxy = mvalidators[mindexOfProxy];
        let gas = 0;
        let id = 0;
        try {
            gas = await contracts[index].methods.burnByLen(len, address).estimateGas({ from: proxy[0] });

            let encodedabi = await contracts[index].methods.burnByLen(len, address).encodeABI();
            id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);

        } catch (error) {
            // console.error(tokenIdRangeLower, "====tokenIdRangeLower===");//,error)
            console.error(address, "====address===", error)

            return -1;
        }

        return id;
    }

    async burnsFromMDContract(len, step, address) {
        for (let i = 0; i < len; i += step) {
            let tss = await this.geTotalSupply();
            console.log("=ss=geTotalSupply==", tss)
            let id = await this.burnFromMDContract(step, address);

            if (id == -1) {
                // break;
            }
            let ts = await this.geTotalSupply();
            let daddress = await this.geBadgeAddress(ts);
            console.log("==geTotalSupply==", ts, "==dead address==", daddress)

        }
    }


    async transferHooToProxy(value) {
        for (let i = 1; i < mvalidators.length; i++) {
            await transferHoo(mvalidators[0][1], mvalidators[0][0], mvalidators[i][0], value);
        }
    }
    async hooBalanceOfProxy() {
        for (let i = 1; i < mvalidators.length; i++) {
            let b = await this.nativeBalanceOf(mvalidators[i][0]);
            console.log("==addr==", mvalidators[i][0], "==bal===", b)
        }
    }
    async setAdminForNFT(address, version) {
        let index = 1;
        if (version != undefined) {
            index = version;
            proxy = validators[0];
        }
        if (version != 0) {
            proxy = mvalidators[0];
        } else {
            proxy = validators[0];
        }

        console.log("setadmin=proxy==", proxy[0])
        let gas = 0;
        gas = await contracts[index].methods.setAdmin(address).estimateGas({ from: proxy[0] });

        let encodedabi = await contracts[index].methods.setAdmin(address).encodeABI();
        let id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }
    async setAdminsForNFT() {
        for (let i = 1; i < mvalidators.length; i++) {
            console.log(i, "==", mvalidators[i][0])
            await this.setAdminForNFT(mvalidators[i][0]);
        }
    }
    async setAdminForMD(addresses) {
        const index = 2;
        proxy = mvalidators[0];
        let gas = 0;
        gas = await contracts[index].methods.setAdmins(addresses).estimateGas({ from: proxy[0] });

        let encodedabi = await contracts[index].methods.setAdmins(addresses).encodeABI();
        let id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }

    async setAdminsForMD() {
        await this.setAdminForMD(mvalidators.map(v => v[0]));
    }
    async setContracts() {
        const index = 2;
        proxy = mvalidators[0];
        let gas = 0;
        gas = await contracts[index].methods.setContract(CONTRACT_ADDRESS[1], CONTRACT_ADDRESS[0]).estimateGas({ from: proxy[0] });

        let encodedabi = await contracts[index].methods.setContract(CONTRACT_ADDRESS[1], CONTRACT_ADDRESS[0]).encodeABI();
        let id = await sendSignedTx(gas, proxy[0], proxy[1], encodedabi, CONTRACT_ADDRESS[index], true);
        return id;
    }
}

function instanceContract() {
    for (let i = 0; i < CONTRACT_ADDRESS.length; i++) {
        abi = require("./abi/" + ABI_FILES[i]).abi;
        contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS[i]);
        // console.log(i, "CONTRACT_ADDRESS[i]==", CONTRACT_ADDRESS[i]);

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
    return new Promise(resolve => setTimeout(() => resolve(), ms));
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
    "mds": (async function () {
        console.log("==migrateToAddresses==");
        let preactionmgmt = new PreActionMgmt()
        let step = process.argv[6];
        let len = process.argv[5];//1100-1999
        let lower = process.argv[4];//12559-11000
        if (lower == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        lower = Number(lower);
        if (len == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        len = Number(len);

       console.log(lower, len, step);
        await preactionmgmt.migrateToAddresses(lower, len, step);

    }),
    "mdf": (async function () {
        console.log("==migrateFromAddress==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.migrateFromAddress();
    }),
    "mdfv2": (async function () {
        console.log("==migrateFromAddressv2==");
        let preactionmgmt = new PreActionMgmt()
        let step = 50;
        let len = process.argv[5];//1100-1999
        let lower = process.argv[4];//12559-11000
        if (lower == undefined) {
            console.error("=====ERROR======lower parameter is empty")
            return;
        }
        lower = Number(lower);
        if (len == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        len = Number(len);
        console.log(lower, len, step);
        await preactionmgmt.migrateFromAddressv2(lower, len);

    }),

    "mafc": (async function () {
        console.log("==migrateToAddressesFromContract==");
        let preactionmgmt = new PreActionMgmt()
        let step = process.argv[5];
        let len = process.argv[5];//1100-1999
        let lower = process.argv[4];//12559-11000
        if (lower == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        lower = Number(lower);
        if (len == undefined) {
            console.error("=====ERROR======lower parameter is empty")
            return;
        }
        len = Number(len);
        if (step == undefined) {
            step = 50;
            console.error("=====WARN==default step =50====step parameter is empty")
        }
        step = Number(step);
        console.log(lower, len, step);
        await preactionmgmt.migrateToAddressesFromContract(lower, len, step);

    }),
    "macmp": (async function () {
        console.log("==migrateAddressCMP==");
        let preactionmgmt = new PreActionMgmt()
        let step = 50;
        let len = process.argv[5];//1100-1999
        let lower = process.argv[4];//12559-11000
        if (lower == undefined) {
            console.error("=====ERROR======lower parameter is empty")
            return;
        }
        lower = Number(lower);
        if (len == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        len = Number(len);
        console.log(lower, len, step);
        await preactionmgmt.migrateAddressCMP(lower, len);

    }),
    "burnsFromMDContract": (async function () {
        console.log("==burnsFromMDContract==");
        let preactionmgmt = new PreActionMgmt()
        let step = 2;
        let len = process.argv[4];//1100-1999
        if (len == undefined) {
            console.error("=====ERROR======len parameter is empty")
            return;
        }
        len = Number(len);
        console.log(len, step);
        let burnaddress = "0x000000000000000000000000000000000000dead";//12559-11000
        await preactionmgmt.burnsFromMDContract(len, step, burnaddress);
    }),
    "setadmin4n": (async function () {
        console.log("==setAdminForNFT==");
        let preactionmgmt = new PreActionMgmt()
        let version = process.argv[4];//md
        console.log("==process.argv[4]==", version);
        if (version == undefined) {
            await preactionmgmt.setAdminsForNFT();
        } else {
            await preactionmgmt.setAdminForNFT(CONTRACT_ADDRESS[2], version);
        }
    }),
    "trasnferhoo": (async function () {
        console.log("==setAdminForNFT==");
        let preactionmgmt = new PreActionMgmt()
        let amount = process.argv[4];//12559-11000
        console.log("==process.argv[4]==", amount);
        if (amount == undefined) {
            console.error("=====ERROR======amount parameter is empty")
            return;
        }
        await preactionmgmt.transferHooToProxy(amount);
        await preactionmgmt.hooBalanceOfProxy();
    }),
    "hoobalance": (async function () {
        console.log("==setAdminForNFT==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.hooBalanceOfProxy();
    }),
    "setadmin4m": (async function () {
        console.log("==setAdminsForMD==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.setAdminsForMD();
    }),
    "setcontracts": (async function () {
        console.log("==setContracts==");
        let preactionmgmt = new PreActionMgmt()
        await preactionmgmt.setContracts(0);
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


module.exports = PreActionMgmt