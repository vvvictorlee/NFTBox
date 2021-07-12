const path = require('path')

const fs = require('fs');
module.exports = (app) => {
    const nft = require('../controllers/nft.controller.js');

    // Create a new NFT
    app.post('/api/claimbadge', async function (req, res, next) {
        await nft.claimbadge(req, res);
    });
    app.post('/api/mybadge', async function (req, res, next) {
        await nft.mybadge(req, res);
    });
    app.get('/badge/*', async function (req, res, next) {
        // const qrcodeName = Date.now() + '-' + Math.random().toString(36).slice(-6);
        const filePath = path.resolve(__dirname, `./flag3_zh-hans.png`);
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
    });



}
