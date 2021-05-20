module.exports = (app) => {
    const nft = require('../controllers/nft.controller.js');

    // Create a new NFT
    app.post('/api/claimbox', async function (req, res, next) {
        await nft.claimbox(req, res);
    });
    app.post('/api/openbox', async function (req, res, next) {
        await nft.myboxs(req, res);
    });
    // Retrieve all NFTs
    app.get('/api/banners', async function (req, res, next) {
        await nft.banners(req, res);
    });
    app.post('/api/myboxes', async function (req, res, next) {
        await nft.myboxes(req, res);
    });
}
