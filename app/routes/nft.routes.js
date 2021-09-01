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
     app.get('/:name/:id', async function (req, res, next) {
        await metadata.metadata(req, res)
    });
    app.get('/images/:name/:id', async function (req, res, next) {
        await metadata.sendimage(req, res)
    });

}
