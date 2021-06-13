const path = require('path')

const fs = require('fs');
const { getJSON, putJSON, readCSVToJSON,readCSV } = require('./util');
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || []
const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
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
        let b = Object.keys(this._users).filter(v=>v.toLowerCase()==user.toLowerCase());
        if (b.length>0)  {
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
        let b = Object.keys(this._users).filter(v=>v.toLowerCase()==user.toLowerCase());
        if (b.length>0)  {
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
        let b = Object.keys(this._boxaddresses).filter(v=>v.toLowerCase()==address.toLowerCase());
        if (b.length>0)  {
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

    async genrandseq() {
        var count = 15000;
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

    async genrandseqx() {
        var count = 80;
        var originalArray = new Array;//原数组 
        //给原数组originalArray赋值 
        for (var i = 0; i < count; i++) {
            originalArray[i] = i + 15000 + 1;
        }
        var d1 = new Date().getTime();
        originalArray.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < count; i++) {
            console.log(" , " + originalArray[i]);
        }
        var d2 = new Date().getTime();
        //console.log("运算耗时" + (d2 - d1));
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


        // 0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b 
        // 0xd63F3cceef518e183e27615A7D6404d0803210Af 
        // 0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d 
        // 0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF 
        // 0xD8f6d61C2cC69c04F176616aD1c7de211b00af31 
        // 0x07f823D3d011f7C612084f04D025F4a026F76afd 
        // 0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC 
        // 0x9d33ea8711b6a37c03aA3a4aE68674901a965F1d 
        // 0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575

        // PuddingSwap    10000个    实际价格0.29U
        // 0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b
        // LENDOO             10w个        实际价格0.029U
        // 0xd63F3cceef518e183e27615A7D6404d0803210Af
        // HeshiSwap      100个        预计价格250U
        // 0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d
        // GFC                     22w个        实际价格0.013U
        // 0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF
        // LOOT                  10w个         实际价格0.012U
        // 0xD8f6d61C2cC69c04F176616aD1c7de211b00af31
        // Yunge                  2w个    预计价格0.2U：
        // 0x07f823D3d011f7C612084f04D025F4a026F76afd
        // 确定参与但是未支付
        // SwapXT              1w个          预计价格1U
        // 0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC
        // （测试币参加，正式币再兑换）
        // Roolend              5000个      预计价格2U
        // 合约地址：0x9d33ea8711b6a37c03aA3a4aE68674901a965F1d
        // （测试币参加，正式币再兑换）
        // SwapAll               1w个，预计价格0.4U。
        // 0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575

        // "PuddingSwap","Lendoo","HeshiSwap","GFC","LOOT","Yunge","SwapXT","Roolend","SwapAll"

        const names = ["PuddingSwap", "Lendoo", "HeshiSwap", "GFC", "LOOT", "Yunge", "SwapXT", "Roolend", "SwapAll"];
        const symbols = ["PUD", "LDT", "HSB", "GFC", "LOOT", "YUNGE", "iXT", "Roolend", "SAP"];

        const col = names.length;
        let json = [];
        for (var i = 0; i < amounts.length; i++) {
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
    // 10000,3000,1100,600,300
    async genBoxLevelJson() {
        const upperbounds = [300, 900, 2000, 5000, 15000];
        // const CONTRACT_ADDRESS = ["0x989418e99E3B29A81906fb9998AEfa74EAae2539", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8",
        //     "0x8970F39632E01C59e4d104AbDD53FB39779aad67", "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
        //     "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a",
        //     "0x93c0cEb6d5e77439A6A33A4cd75F28a965706209", "0x8970F39632E01C59e4d104AbDD53FB39779aad67",
        //     "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
        //     "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a"
        // ];

        // const MAINNET_CONTRACT_ADDRESS = ["0x989418e99E3B29A81906fb9998AEfa74EAae2539", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8",
        //     "0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b", "0xd63F3cceef518e183e27615A7D6404d0803210Af",
        //     "0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d",
        //     "0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF", "0xD8f6d61C2cC69c04F176616aD1c7de211b00af31", "0x07f823D3d011f7C612084f04D025F4a026F76afd", "0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC", "0x9d33ea8711b6a37c03aA3a4aE68674901a965F1d",
        //     "0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575"
        // ];
        // CONTRACT_ADDRESS = ["0xDf579406112E143bEb9e507a1809EF7ce40943f8", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8","0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b", "0xd63F3cceef518e183e27615A7D6404d0803210Af","0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d","0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF", "0xD8f6d61C2cC69c04F176616aD1c7de211b00af31", "0x07f823D3d011f7C612084f04D025F4a026F76afd", "0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC", "","0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575"]

        const addresses = CONTRACT_ADDRESS.slice(3)
        // const addresses = ["0x8970F39632E01C59e4d104AbDD53FB39779aad67", "0x296010CADc0B2E78A4dB3f83d9dE712C8112A7e8",
        //     "0xcC5d00BD9f416Fa7640292d9C1B23E03Bd0219D2", "0x35B8878FAe85CcdAaaF991b41aed201F4F35C42a"];
        let json = [];
        for (var i = 0; i < upperbounds.length; i++) {
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

    async getTotalAmounts() {
        const addresses = CONTRACT_ADDRESS.slice(3);
        const amounts = ["10000", "100000", "100", "220000", "100000", "20000", "10000", "5000", "10000"];
        return { "ids": addresses, "amounts": amounts }
    }

    async readUserFromCsv() {
        const csvfile = "/jsons/mainnetdata/" + "top10000.csv";
        const json = readCSVToJSON(csvfile)
        putJSON(users, json)
    }

    async checkUserTimesWrong() {
        let boxaddrs = getJSON("jsons/mainnetdata06080642/boxaddresses.json")
        let users = getJSON("jsons/mainnetdata0607/users.json")
        let users8 = getJSON("jsons/mainnetdata06080642/users.json")
        let userso = getJSON("jsons/mainnet/users.json")

        let s = Object.keys(boxaddrs).filter(v => Number(boxaddrs[v].length) > Number(userso[v]))
        console.log("s length==", s.length)
        s.map(u => console.log(u, "=", users[u], "=", users8[u], "=", userso[u], "=", boxaddrs[u].length))
        let t = s.reduce((acc, u) => acc += boxaddrs[u].length - userso[u], 0)
        console.log("t==", t)
    }

    async getBoxLevel(randomNumber) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }
        let i = 0;
        for (i = 0; i < this._boxlevels.length; ++i) {
            if (Number(randomNumber) <= Number(this._boxlevels[i].upperbound)) {
                return i + 1;
            }
        }
        return 0;
    }

    async checkRand() {
        let r = getJSON("jsons/mainnetdata0609/r.json")
        let r2 = getJSON("jsons/mainnetdata0609/randomsequence.json")
        let count = 0;
        let levels = {};
        let levels2 = {};
        for (let i = 1; i <= 5; i++) {
            levels[i] = 0
            levels2[i] = 0
        }
        for (let i = 0; i < r.length; i++) {
            if (r[i] > 15000) {
                console.error("=================", r[i])
            }
            if (r[i] != r2[i]) {
                count++
                let l = await this.getBoxLevel(r[i])
                let l2 = await this.getBoxLevel(r2[i])
                levels[l]++
                levels2[l2]++
                console.log(l, "=", r[i], "=", r2[i], "=", r2[i], "=", l2)
            }
        }

        console.log("count==", count, "levels==", levels, "levels2==", levels2)
    }

    async checkUserNumberOne(addr) {
        let boxaddrs = getJSON("jsons/mainnetdata0610/boxaddresses.json")
        let openedboxes = getJSON("jsons/mainnetdata0610/openedboxes.json")
        let _users = getJSON("jsons/mainnetdata0610/users.json")
        const one = "0x607fe8Ce38097A3e71acBE1FD814bbb0D65C46c3";
        const inone = "0x607fe8Ce38097A3e71acBE1FD814bbb0D65c46c3";

        let b = Object.keys(_users).filter(v=>v.toLowerCase()==inone.toLowerCase());
        if (b.length>0){
        addr = b[0];
}
        console.log("b",b,"addr",addr);
        let s = boxaddrs[one].filter(v => openedboxes.indexOf(v.boxAddress) == -1)
        console.log(boxaddrs[one].length,"unopenboxes length==", s.length)
        let oneamounts = new Array(amounts[0].length).fill(0);
        let levelcounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (let u of boxaddrs[one]) {
            // console.log("u.level==",u, u.level)
            levelcounts[u.level]++;
        }

        console.log("levelcounts==", levelcounts)
        console.log("oneamounts==", oneamounts)
        for (let l of Object.keys(levelcounts)) {
            // console.log("l==", l)
            let levelamounts = await this.getLevelAwardAmounts(l-1)
            for (let i = 0; i < levelamounts.length; i++) {
                oneamounts[i] = Number(oneamounts[i])+Number(levelamounts[i])*Number(levelcounts[l]);
            }
        }
        const names = ["PuddingSwap", "Lendoo", "HeshiSwap", "GFC", "LOOT", "Yunge", "SwapXT", "Roolend", "SwapAll"];
        const symbols = ["PUD", "LDT", "HSB", "GFC", "LOOT", "YUNGE", "iXT", "Roolend", "SAP"];

        const addresses = CONTRACT_ADDRESS.slice(3)
        console.log("names==", names)
        console.log("symbols==", symbols)
        console.log("addresses==", addresses)
        console.log("oneamounts==", oneamounts)
    }

    async getLevelAwardAmounts(level) {
        if (this._boxlevels == null) {
            this._boxlevels = getJSON(boxlevels)
        }

        return this._boxlevels[level].tokens.amounts;
    }


    async addAddresses() {
        let addresses = readCSV("/jsons/mainnetdata/12.csv")
        console.log("========addresses=========",addresses)
        let emails= getJSON("/jsons/mainnetdata/wrongaddresses.json")
       console.log("=========emails========",emails)
        let s={};
        addresses.map(u => {if (u[0]!=undefined && u[0].length>0){ s[u[0]]=emails[u[1]];}} )
        console.log("s==",s)




    }


}
const amounts = [
    ["3.1847", "31.8471", "0.03184", "70.0636", "31.8471", "6.3694", "63.694", "1.5923", "3.1847"],
    ["1.5923", "15.9235", "0.01592", "35.0318", "15.9235", "3.1847", "31.847", "0.7961", "1.5923"],
    ["1.2738", "12.7388", "0.01273", "28.0254", "12.7388", "2.5477", "25.477", "0.6369", "1.2738"],
    ["0.6369", "6.3694", "0.00636", "14.0127", "6.3694", "1.2738", "12.738", "0.3184", "0.6369"],
    ["0.4777", "4.777", "0.00477", "10.5095", "4.777", "0.9554", "9.554", "0.2388", "0.4777"]
];
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
    "genrandseq": (async function () {
        console.log("==genrandseq==");
        let datamgmt = new DataMgmt()
        await datamgmt.genrandseq();
    }),
    "genrandseqx": (async function () {
        console.log("==genrandseqx==");
        let datamgmt = new DataMgmt()
        await datamgmt.genrandseqx();
    }),
    "genlevel": (async function () {
        console.log("==genlevel==");
        let datamgmt = new DataMgmt()
        await datamgmt.genBoxLevelJson();
        await datamgmt.genBoxInfoJson();
    }),
    "readcsv": (async function () {
        console.log("==readcsv==");
        let datamgmt = new DataMgmt()
        await datamgmt.readUserFromCsv();
    }),
    "wrong": (async function () {
        console.log("==checkUserTimesWrong==");
        let datamgmt = new DataMgmt()
        await datamgmt.checkUserTimesWrong();
    }),
    "rand": (async function () {
        console.log("==checkRand==");
        let datamgmt = new DataMgmt()
        await datamgmt.checkRand();
    }),
    "one": (async function () {
        console.log("==checkUserNumberOne==");
        let datamgmt = new DataMgmt()
        await datamgmt.checkUserNumberOne();
    }),
  "add": (async function () {
        console.log("==addAddresses==");
        let datamgmt = new DataMgmt()
        await datamgmt.addAddresses();
    }),
    "default": (async function () {
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

module.exports = DataMgmt