const ActionMgmt = require('../../actionmgmt.js');
const DataMgmt = require('../../datamgmt.js');
const actionMgmt = new ActionMgmt();
const dataMgmt = new DataMgmt();
const path = require('path')
const fs = require('fs');
exports.sendimage = async (req, res) => {
    console.log("sss");
    // const qrcodeName = Date.now() + '-' + Math.random().toString(36).slice(-6);
    const filePath = path.resolve(__dirname, "../images/" + req.params.name + ".png");
    // 给客户端返回一个文件流
    res.writeHead(200, { 'Content-Type': 'image/png' });
    //格式必须为 binary，否则会出错
    // 创建文件可读流
    const cs = fs.createReadStream(filePath);
    cs.on("data", chunk => {
        res.write(chunk);
    })
    cs.on("end", () => {
        res.status(200);
        res.end();
    })
};

// Find a single note with a noteId
exports.metadata = async (req, res) => {
    const defaultjson = {
        name: 'Multi-chain Miner v2',
        image: 'https://badge.hoosmartchain.com/images/',
        description: ''
    }
    let json = await dataMgmt.getNFTMetaData(req.params.name);
    if (json == undefined) {
        json = defaultjson;
    }
    json.image += req.params.name + "/" + req.params.id;
    res.send(json);
};

