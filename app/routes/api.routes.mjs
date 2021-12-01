import path  from 'path'

import fs  from 'fs';
import {authorize}  from '../_helpers/authorize.mjs'

    import {NFT}  from '../controllers/api.controller.mjs';
const nft = new NFT();
export default  (app) => {

    // Create a new NFT
    // app.post('/api/gasfeereport',authorize(), async function (req, res, next) {
    //     await nft.gasFeeReport(req, res);
    // });
    app.post('/api/gasfeereport',async function (req, res, next) {
        await nft.gasFeeReport(req, res);
    });
    app.post('/api/interactivereport', async function (req, res, next) {
        await nft.interactiveReport(req, res);
    });
    app.post('/api/assetreport', async function (req, res, next) {
        await nft.assetReport(req, res);
    });
}
