module.exports = (app) => {
    const nft = require('../controllers/nft.controller.js');

    // Create a new NFT
    app.post('/api/claimbadge', async function (req, res, next) {
        await nft.claimbadge(req, res);
    });
   app.post('/api/mybadge', async function (req, res, next) {
        await nft.mybadge(req, res);
    });
}
