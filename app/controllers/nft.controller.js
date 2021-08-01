const ActionMgmt = require('../../actionmgmt.js');
const DataMgmt = require('../../datamgmt.js');
const actionMgmt = new ActionMgmt();
const dataMgmt = new DataMgmt();
// Create and Save a new Note
exports.claimbadge = async (req, res) => {
    // Validate request
    if (req.body.params.address==undefined||!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }
    if (req.body.params.ip==undefined||!req.body.params.ip) {
        return res.status(400).send({
            message: "ip can not be empty"
        });
    }
    let [result, msg] = await actionMgmt.claimBadge(req.body.params.address.toLowerCase(),req.body.params.ip.toLowerCase());

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
        data:  {tokenId:msg}
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

    let [result, msg]  = await actionMgmt.getBadge(req.body.params.address.toLowerCase());

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
            tokenId:msg
        }

    }
    res.send(json);

};


// Find a single note with a noteId
exports.isMaxTotalSupply = async (req, res) => {
    let msg  = await actionMgmt.isMaxTotalSupply();

      const json = {
        code: 10000,
        message: 'success',
        data: {
            flag:msg
        }

    }
    res.send(json);

};