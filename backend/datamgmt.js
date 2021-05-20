const path = require('path')

const fs = require('fs');
const { getJSON, putJSON } = require('./util');
const datapath = "/jsons/"
const users = datapath + "users.json";
const tokenids = datapath + "tokenids.json";
const randomsequence = datapath + "randomsequence.json";
const currentindex = datapath + "currentindex.json";
const boxlevels = datapath + "boxlevels.json";
class DataMgmt {
    _users = null;
    _tokeids = null;
    _randSeq = null;
    _boxlevels = null;
    async getBoxLevelAward(randomNumber) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }
        let i = 0;
        for (i = 0; i < this._boxlevels.length; ++i) {
            if (Number(randomNumber) >= Number(this._boxlevels[i].upperbound)) {
                return [i + 1, this._boxlevels[i].tokens];
            }
        }
        return [0, {}];
    }

    async checkUserTimes(user) {
        if (this._users == null) {
            this._users = getJSON(users)
        }
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            return true;
        }
        return false;
    }

    async updateUserTimes(user) {
        if (this._users == null) {
            this._users = getJSON(users)
        }
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            this._users[user] = Number(this._users[user]) - 1
            putJSON(users, this._users)
            return this._users[user];
        }
        console.error(user, "updateUserTimes failed");
    }

    async saveBoxDetail(address, detailInfo, isBoxAddressOption) {
        const isBoxAddress = isBoxAddressOption || false
        if (this._tokeids == null) {
            this._tokeids = getJSON(tokenids)
        }
        if (this._tokeids[address] == undefined) {
            this._tokeids[address] = [];
        }

        this._tokeids[address].push(detailInfo)

        putJSON(tokenids, this._tokeids)

    }

    async getBoxDetail(boxAddress) {
        if (this._tokeids == null) {
            this._tokeids = getJSON(tokenids)
        }
        if (this._tokeids[boxAddress] == undefined) {
            return {};
        }

        return this._tokeids[boxAddress][0]
    }
    async genrandseq() {
        var count = 20000;
        var originalArray = new Array;//原数组 
        //给原数组originalArray赋值 
        for (var i = 0; i < count; i++) {
            originalArray[i] = i + 1;
        }
        var d1 = new Date().getTime();
        originalArray.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < count; i++) {
            console.log(originalArray[i] + " , ");
        }
        var d2 = new Date().getTime();
        console.log("运算耗时" + (d2 - d1));
        putJSON(randomsequence, originalArray)
    }

    async getRandSeqValue() {
        if (this._randSeq == null) {
            this._randSeq = getJSON(randomsequence)
        }
        let ci = await this.getCurrentIndex();

        return this._randSeq[ci];
    }

    async getCurrentIndex() {
        let currindex = getJSON(currentindex);
        putJSON(currentindex, currindex + 1);
        return currindex;
    }

}

async function test() {
    let dataMgmt = new DataMgmt()
    let user = 1;
    let tokenId = 2;
    // await dataMgmt.genrandseq();
    // let r;
    // for (let i = 0; i < 3; i++) {
    //     r = await dataMgmt.getRandSeqValue();
    //     console.log(r)
    // }
    // for (let i = 3; i < 49; i += 20) {
    //     r = await dataMgmt.getBoxLevelAward(i);
    //     console.log(r)
    // }
    // for (let i = 3; i < 49; i += 20) {
    //     await dataMgmt.saveTokenId(i, i + 10);
    // }

    for (let i = 0; i < 3; i++) {
        r = await dataMgmt.checkUserTimes(i + 1);
        console.log(r)
    }

    for (let i = 0; i < 3; i++) {
        await dataMgmt.updateUserTimes(i + 1);
    }


}
// test();

module.exports = DataMgmt