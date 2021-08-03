const ActionMgmt = require('../../actionmgmt.js');
const actionMgmt = new ActionMgmt();
const userService = require('../users/user.service');
const paused = process.env.PAUSED;
// Create and Save a new Note
exports.claimbadge = async (req, res) => {
    console.log("headers = " + JSON.stringify(req.headers));// 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    console.log("x-forwarded-for = " + req.header('x-forwarded-for'));// 各阶段ip的CSV, 最左侧的是原始ip
    console.log("ips = " + JSON.stringify(req.ips));// 相当于(req.header('x-forwarded-for') || '').split(',')
    console.log("remoteAddress = " + req.connection.remoteAddress);// 未发生代理时，请求的ip
    console.log("socketremoteAddress = " + req.socket.remoteAddress);// 未发生代理时，请求的ip
    console.log("ip = " + req.ip);// 同req.connection.remoteAddress, 但是格式要好一些

    // Validate request
    if (paused) {
        return res.status(400).send({
            message: "claim  out of service"
        });
    }

    // Validate request
    if (req.body.params.address == undefined || !req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }
    if (req.body.params.ip == undefined || !req.body.params.ip) {
        return res.status(400).send({
            message: "ip can not be empty"
        });
    }
    let [result, msg] = await actionMgmt.claimBadge(req.body.params.address.toLowerCase(), req.body.params.ip.toLowerCase());

    console.log(result, msg)
    if (Number(0) != Number(result)) {
        return res.send({
            code: result,
            message: msg
        });
    }

    const json = {
        code: 10000,
        message: 'success',
        data: { tokenId: msg }
    }
    res.send(json);
};


// Find a single note with a noteId
exports.mybadge = async (req, res) => {

    //console.log(req.body)
    if (!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }

    let [result, msg] = await actionMgmt.getBadge(req.body.params.address.toLowerCase());

    console.log(result, msg)
    if (Number(0) != Number(result)) {
        return res.send({
            code: result,
            message: msg
        });
    }
    const json = {
        code: 10000,
        message: 'success',
        data: {
            tokenId: msg
        }

    }
    res.send(json);

};


// Find a single note with a noteId
exports.isMaxTotalSupply = async (req, res) => {
    console.log("headers = " + JSON.stringify(req.headers));// 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    console.log("x-forwarded-for = " + req.header('x-forwarded-for'));// 各阶段ip的CSV, 最左侧的是原始ip
    console.log("ips = " + JSON.stringify(req.ips));// 相当于(req.header('x-forwarded-for') || '').split(',')
    console.log("remoteAddress = " + req.connection.remoteAddress);// 未发生代理时，请求的ip
    console.log("socketremoteAddress = " + req.socket.remoteAddress);// 未发生代理时，请求的ip
    console.log("ip = " + req.ip);// 同req.connection.remoteAddress, 但是格式要好一些

    if (req.body.params.address == undefined || !req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }
    if (req.body.params.ip == undefined || !req.body.params.ip) {
        return res.status(400).send({
            message: "ip can not be empty"
        });
    }
    let token = await userService.authenticate(req.body.params);

    let msg = await actionMgmt.isMaxTotalSupply();

    const json = {
        code: 10000,
        message: 'success',
        data: {
            token:token,
            flag: msg
        }

    }
    res.send(json);

};