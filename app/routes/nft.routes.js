const path = require('path')

const fs = require('fs');

module.exports = (app) => {
    const nft = require('../controllers/nft.controller.js');
    const metadata = require('../controllers/metadata.controller.js');
    // Create a new NFT
    app.post('/api/claimbadge', async function (req, res, next) {
        await nft.claimbadge(req, res);
    });
    app.post('/api/mybadge', async function (req, res, next) {
        await nft.mybadge(req, res);
    });
    // app.get('/badge/*', async function (req, res, next) {
    //     await metadata.sendimage(req, res, `./flag3_zh-hans.png`)
    // });
    // app.get('/wofans/*', async function (req, res, next) {
    //     await metadata.sendimage(req, res, `./wofans.png`)
    // });
    // app.get('/tst/*', async function (req, res, next) {
    //     await metadata.sendimage(req, res, `./tst.png`)
    // });
    // app.get('/joint/*', async function (req, res, next) {
    //     await metadata.sendimage(req, res, `./joint.png`)
    // });
    // app.get('/miner/*', async function (req, res, next) {
    //     await metadata.sendimage(req, res, `./miner.png`)
    // });
    // app.get('/minerv2/:id', async function (req, res, next) {
    //     const json = {
    //         name: 'Multi-chain Miner v2',
    //         image: 'https://badge.hoosmartchain.com/minerv2/' + req.params.id,
    //         description: ''
    //     }
    //     res.send(json);
    // });
    app.get('/:name/:id', async function (req, res, next) {
        console.log(req.params)
        await metadata.metadata(req, res)
    });
    app.get('/images/:name/:id', async function (req, res, next) {
        console.log("images==",req.params)
        await metadata.sendimage(req, res)
        // const filePath = path.resolve(__dirname, `./minerv2.png`);
        // res.writeHead(200, { 'Content-Type': 'image/png' });
        // const cs = fs.createReadStream(filePath);
        // cs.on("data", chunk => {
        //     res.write(chunk);
        // })
        // cs.on("end", () => {
        //     res.status(200);
        //     res.end();
        // })
    });

}
