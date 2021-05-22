const path = require('path')

const fs = require('fs');
const { getJSON, putJSON } = require('./util');
const datapath = "/jsons/"
const users = datapath + "users.json";
const tokenids = datapath + "tokenids.json";
const randomsequence = datapath + "randomsequence.json";
const currentindex = datapath + "currentindex.json";
const boxlevels = datapath + "boxlevels.json";
const boxlevelinfo = datapath + "boxlevelinfo.json";
const openedboxes = datapath + "openedboxes.json";
class DataMgmt {
    _users = null;
    _tokeids = null;
    _randSeq = null;
    _boxlevels = null;
    _boxlevelinfo = null;
    _openedboxes = null;
    async getBoxLevelAward(randomNumber) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }
        let i = 0;
        for (i = 0; i < this._boxlevels.length; ++i) {
            if (Number(randomNumber) > Number(this._boxlevels[i].upperbound)) {
                return [i + 1, this._boxlevels[i].tokens];
            }
        }
        return [0, {}];
    }

    async checkUserTimes(user) {
        this._users = getJSON(users)
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            return true;
        }
        return false;
    }

    async updateUserTimes(user) {
        this._users = getJSON(users)
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            this._users[user] = Number(this._users[user]) - 1
            putJSON(users, this._users)
            return this._users[user];
        }
        console.error(user, "updateUserTimes failed");
    }

    async saveBoxDetail(address, detailInfo, isBoxAddressOption) {
        const isBoxAddress = isBoxAddressOption || false
        this._tokeids = getJSON(tokenids)
        if (this._tokeids[address] == undefined) {
            this._tokeids[address] = [];
        }

        this._tokeids[address].push(detailInfo)

        putJSON(tokenids, this._tokeids)

    }

    async saveOpenedBoxAddress(address) {
        this._openedboxes = getJSON(openedboxes)

        this._openedboxes.push(address)

        putJSON(openedboxes, this._openedboxes)

    }

    async checkOpenedBoxAddress(address) {
        this._openedboxes = getJSON(openedboxes)

        return -1 != this._openedboxes.indexOf(address)
    }

    async getBoxAddresses(address) {
        this._tokeids = getJSON(tokenids)
        // //console.log(address,"======getBoxAddresses=====",this._tokeids)
        if (this._tokeids[address] == undefined) {
            return {};
        }

        this._openedboxes = getJSON(openedboxes)

        const result = this._tokeids[address].filter((v) => -1 == this._openedboxes.indexOf(v.boxAddress));
        return result;
    }

    async getBoxDetail(boxAddress) {
        this._tokeids = getJSON(tokenids)
        if (this._tokeids[boxAddress] == undefined) {
            return {};
        }

        return this._tokeids[boxAddress][0]
    }
    async genrandseq() {
        var count = 10000;
        var originalArray = new Array;//原数组 
        //给原数组originalArray赋值 
        for (var i = 0; i < count; i++) {
            originalArray[i] = i + 1;
        }
        var d1 = new Date().getTime();
        originalArray.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < count; i++) {
            //console.log(originalArray[i] + " , ");
        }
        var d2 = new Date().getTime();
        //console.log("运算耗时" + (d2 - d1));
        putJSON(randomsequence, originalArray)
    }

    async getRandSeqValue() {
        this._randSeq = getJSON(randomsequence)
        let ci = await this.getCurrentIndex();

        return this._randSeq[ci];
    }

    async getCurrentIndex() {
        let currindex = getJSON(currentindex);
        putJSON(currentindex, currindex + 1);
        return currindex;
    }



    async getBoxInfoJson(index) {
        const i = index | 0;
        this._boxlevelinfo = getJSON(boxlevelinfo)
        if (0 == i) {
            return this._boxlevelinfo;
        }
        return this._boxlevelinfo[i - 1].tokens;
    }

    async genBoxInfoJson() {

        // 盲盒	PuddingSwap	Lendoo	HeshiSwap	SwapAll
        // 黑铁	0.607	6.072	0.00607	0.607
        // 青铜	0.809	8.097	0.00809	0.809
        // 白银	1.619	16.194	0.01619	1.619
        // 黄金	2.024	20.242	0.02024	2.024
        // 钻石	4.048	40.485	0.04048	4.048

        const names = ["PuddingSwap", "Lendoo", "HeshiSwap", "SwapAll"];
        const symbols = ["PUDDINGSWAP", "LENDOO", "HESHISWAP", "SWAPALL"];
        const amounts = [
            ["0.607", "6.072", "0.00607", "0.607"],
            ["0.809", "8.097", "0.00809", "0.809"],
            ["1.619", "16.194", "0.01619", "1.619"],
            ["2.024", "20.242", "0.02024", "2.024"],
            ["4.048", "40.485", "0.04048", "4.048"]
        ];
        const count = 5;
        const col = 4;
        let json = [];
        for (var i = 0; i < count; i++) {
            let obj = {};
            let tokens = [];
            obj["level"] = i + 1;
            tokens = [];
            for (let j = 0; j < col; j++) {
                let token = {};
                token["name"] = names[j];
                token["symbol"] = symbols[j];
                token["amount"] = amounts[i][j];
                tokens.push(token);
            }
            obj["tokens"] = tokens;
            json.push(obj)
        }

        putJSON(boxlevelinfo, json)
    }

    // 5000,2500,1300,1000,200
    async genBoxLevelJson() {
        const upperbounds = [5000, 2500, 1200, 200, 0];
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ["0x989418e99E3B29A81906fb9998AEfa74EAae2539", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8",
            "0x8970F39632E01C59e4d104AbDD53FB39779aad67", "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
            "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a",
            "0x93c0cEb6d5e77439A6A33A4cd75F28a965706209"
        ];
        const addresses = CONTRACT_ADDRESS.slice(2, 6)
        // const addresses = ["0x8970F39632E01C59e4d104AbDD53FB39779aad67", "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
        //     "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a"];
        const amounts = [
            ["0.607", "6.072", "0.00607", "0.607"],
            ["0.809", "8.097", "0.00809", "0.809"],
            ["1.619", "16.194", "0.01619", "1.619"],
            ["2.024", "20.242", "0.02024", "2.024"],
            ["4.048", "40.485", "0.04048", "4.048"]
        ];
        const count = 5;
        const col = 4;
        let json = [];
        for (var i = 0; i < count; i++) {
            let obj = {};
            let tokens = [];
            obj["upperbound"] = upperbounds[i];
            let token = {};
            token["ids"] = addresses;
            token["amounts"] = amounts[i];
            obj["tokens"] = token;
            json.push(obj)
        }

        putJSON(boxlevels, json)
    }
}

async function test() {
    let dataMgmt = new DataMgmt()
    let user = 1;
    let tokenId = 2;
    let r;

    // await dataMgmt.genBoxLevelJson();
    // await dataMgmt.genBoxInfoJson();
    // r = await dataMgmt.getBoxInfoJson();
    // //console.log(JSON.stringify(r))
    // r = await dataMgmt.getBoxInfoJson(1);
    //console.log(JSON.stringify(r))
    r = await dataMgmt.getBoxAddresses("0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e");
    console.log(JSON.stringify(r))
    // await dataMgmt.genrandseq();
    // for (let i = 0; i < 3; i++) {
    //     r = await dataMgmt.getRandSeqValue();
    //     //console.log(r)
    // }
    // for (let i = 3; i < 49; i += 20) {
    //     r = await dataMgmt.getBoxLevelAward(i);
    //     //console.log(r)
    // }
    // for (let i = 3; i < 49; i += 20) {
    //     await dataMgmt.saveTokenId(i, i + 10);
    // }

    // for (let i = 0; i < 3; i++) {
    //     r = await dataMgmt.checkUserTimes(i + 1);
    //     //console.log(r)
    // }

    // for (let i = 0; i < 3; i++) {
    //     await dataMgmt.updateUserTimes(i + 1);
    // }


}
// test();

module.exports = DataMgmt