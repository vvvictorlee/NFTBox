const ActionMgmt = require('../../actionmgmt.js');
const DataMgmt = require('../../datamgmt.js');
const actionMgmt = new ActionMgmt();
const dataMgmt = new DataMgmt();
// Create and Save a new Note
exports.claimbox = async (req, res) => {
    // Validate request
    if (!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }

    let result = null;
    if (req.body.params.times != undefined) {
        if (Number(req.body.params.times) <= 0 || Number(req.body.params.times) > 10) {
            return res.send({
                code: 10001,
                message: 'times must be between 1 and 10'
            });
        }

        const addresses = req.body.params.address;
        let results = {};
        for (let i = 0; i < req.body.params.times; i++) {
            result = await actionMgmt.claimBox(req.body.params.address);
            console.log(result)
            results[i + 1] = result;
            if (Number(0) != Number(result)) {
                break;
            }
        }
        result = results;
    }
    else {
        result = await actionMgmt.claimBox(req.body.params.address);
        console.log(result)
    }

    if (null == result) {
        return res.send({
            code: 10001,
            message: 'fail'
        });
    }
    const json = {
        code: 10000,
        message: 'success',
        data: result
    }
    res.send(json);
};


// Create and Save a new Note
exports.openbox = async (req, res) => {
    // Validate request
    if (!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }
    let result = null;
    let msg = "";
    if (Array.isArray(req.body.params.address)) {
        const addresses = req.body.params.address;
        let results = {};
        let msgs = {};
        for (let address of addresses) {
            [result, msg] = await actionMgmt.openBox(address);
            console.log(result, msg)
            results[address] = result;
            msgs[address] = msg;
        }
        result = results;
        msg = msgs;
    }
    else {
        [result, msg] = await actionMgmt.openBox(req.body.params.address);
        console.log(result, msg)

    }

    if (Number(0) != Number(result)) {
        return res.send({
            code: 10001,
            message: msg
        });
    }
    const json = {
        code: 10000,
        message: 'success',
        data: msg
    }
    res.send(json);

};

// Find a single note with a noteId
exports.banners = async (req, res) => {
    const info = await dataMgmt.getBoxInfoJson();
    const json = {
        code: 10000,
        message: 'success',
        data: {
            records: info
        }
    };

    res.send(json);

    // res.status(404).send({
    //     message: "Note not found with id " + req.params.noteId
    // });
    // res.send(note);
    // if (err.kind === 'ObjectId') {
    //     return res.status(404).send({
    //         message: "Note not found with id " + req.params.noteId
    //     });
    // }
    // return res.status(500).send({
    //     message: "Error retrieving note with id " + req.params.noteId
    // });
};

// Find a single note with a noteId
exports.myboxes = async (req, res) => {
    //console.log(req.body)
    if (!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }

    const boxes = await dataMgmt.getBoxAddresses(req.body.params.address);

    const json = {
        code: 10000,
        message: 'success',
        data: {
            records: boxes
        }

    }
    res.send(json);

};

