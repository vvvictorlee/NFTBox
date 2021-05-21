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

    const result = await actionMgmt.claimBox(req.body.params.address);
    if (null == result) {
        return res.status(404).send({
            code: 10001,
            message: 'fail',
            data: ""
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

    const result = await actionMgmt.openBox(req.body.params.address);
    if (null == result) {
        return res.status(404).send({
            code: 10001,
            message: 'fail',
            data: ""
        });
    }
    const json = {
        code: 10000,
        message: 'success',
        data: result
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
    console.log(req.body)
    if (!req.body.params.address) {
        return res.status(400).send({
            message: "address can not be empty"
        });
    }

    res.header('Content-Type', 'application/json');

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

