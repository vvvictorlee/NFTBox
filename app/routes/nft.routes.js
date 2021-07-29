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
    app.get('/api/ismaxtotalsupply', async function (req, res, next) {
        await nft.isMaxTotalSupply(req, res);
    });
    app.get('/joint/*', async function (req, res, next) {
        console.log(req.ip)
        const filePath = path.resolve(__dirname, `./joint.png`);
        res.writeHead(200, { 'Content-Type': 'image/png' });
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
