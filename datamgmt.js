const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON, readCSV,writeCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
const _TOTAL_AMOUNTS = process.env.TOTAL_AMOUNTS || []
const TOTAL_AMOUNTS = JSON.parse(_TOTAL_AMOUNTS);



const datapath = process.env.DATA_PATH || "/jsons/"
const users = datapath + "users.json";
const boxaddresses = datapath + "boxaddresses.json";
const boxdetail = datapath + "boxdetail.json";
const randomsequence = datapath + "randomsequence.json";
const currentindex = datapath + "currentindex.json";
const boxlevels = datapath + "boxlevels.json";
const boxlevelinfo = datapath + "boxlevelinfo.json";
const openedboxes = datapath + "openedboxes.json";
class DataMgmt {
    _users = null;
    _boxaddresses = null;
    _boxdetail = null;
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
            if (Number(randomNumber) <= Number(this._boxlevels[i].upperbound)) {
                return [i + 1, this._boxlevels[i].tokens];
            }
        }
        return [0, {}];
    }

    async checkUserTimes(user) {
        this._users = getJSON(users)
        let b = Object.keys(this._users).filter(v => v.toLowerCase() == user.toLowerCase());
        if (b.length > 0) {
            user = b[0];
        }
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            return true;
        }
        console.error("checkUserTimes==", user)
        return false;
    }

    async updateUserTimes(user) {
        this._users = getJSON(users)
        let b = Object.keys(this._users).filter(v => v.toLowerCase() == user.toLowerCase());
        if (b.length > 0) {
            user = b[0];
        }
        if (this._users[user] != undefined && Number(this._users[user]) > 0) {
            this._users[user] = Number(this._users[user]) - 1
            putJSON(users, this._users)
            return this._users[user];
        }
        console.error(user, "updateUserTimes failed");
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
        address = address.toLowerCase();
        this._boxaddresses = getJSON(boxaddresses)
        // //console.log(address,"======getBoxAddresses=====",this._boxaddresses)
        let b = Object.keys(this._boxaddresses).filter(v => v.toLowerCase() == address.toLowerCase());
        if (b.length > 0) {
            address = b[0];
        }
        if (this._boxaddresses[address] == undefined) {
            return {};
        }

        this._openedboxes = getJSON(openedboxes)

        const result = this._boxaddresses[address].filter((v) => -1 == this._openedboxes.indexOf(v.boxAddress));
        return result;
    }

    async saveBoxAddresses(address, boxAddress) {
        this._boxaddresses = getJSON(boxaddresses)
        if (this._boxaddresses[address] == undefined) {
            this._boxaddresses[address] = [];
        }

        this._boxaddresses[address].push(boxAddress)

        putJSON(boxaddresses, this._boxaddresses)

    }

    async saveBoxDetail(address, detailInfo) {
        this._boxdetail = getJSON(boxdetail)

        this._boxdetail[address] = detailInfo

        putJSON(boxdetail, this._boxdetail)

    }

    async getBoxDetail(boxAddress) {
        this._boxdetail = getJSON(boxdetail)
        if (this._boxdetail[boxAddress] == undefined) {
            return {};
        }

        if (Array.isArray(this._boxdetail[boxAddress])) {
            return this._boxdetail[boxAddress][0];
        }

        return this._boxdetail[boxAddress];
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

    async getTOTAL_AMOUNTS() {
        const addresses = CONTRACT_ADDRESS.slice(3);
        return { "ids": addresses, "amounts": TOTAL_AMOUNTS }
    }
}

async function test() {
    let datamgmt = new DataMgmt()
    let user = 1;
    let tokenId = 2;
    let r;

    // await datamgmt.genBoxLevelJson();
    // await datamgmt.genBoxInfoJson();
    // r = await datamgmt.getBoxInfoJson();
    // //console.log(JSON.stringify(r))
    // r = await datamgmt.getBoxInfoJson(1);
    // console.log(JSON.stringify(r))
    // await datamgmt.saveBoxAddresses("0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e", { "boxAddress": "boxAddress", "level": "1" });

    // r = await datamgmt.getBoxAddresses("0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e");
    // console.log(JSON.stringify(r))
    // await datamgmt.saveBoxDetail("boxAddress", { "tokenId": "tokenId", "randomNumber": "23" });
    // r = await datamgmt.getBoxDetail("boxAddress");
    // console.log(JSON.stringify(r))
    // await datamgmt.genrandseq();
    // for (let i = 0; i < 3; i++) {
    //     r = await datamgmt.getRandSeqValue();
    //     //console.log(r)
    // }
    // const levels = [3, 230, 1300, 3300, 5500]
    // for (let i = 0; i < levels.length; i++) {
    //     r = await datamgmt.getBoxLevelAward(levels[i]);
    //     console.log(r)
    // }
    // for (let i = 3; i < 49; i += 20) {
    //     await datamgmt.saveTokenId(i, i + 10);
    // }

    // for (let i = 0; i < 3; i++) {
    //     r = await datamgmt.checkUserTimes(i + 1);
    //     //console.log(r)
    // }

    // for (let i = 0; i < 3; i++) {
    //     await datamgmt.updateUserTimes(i + 1);
    // }


}



let handlers = {
    "t": (async function () {
        test();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

module.exports = DataMgmt