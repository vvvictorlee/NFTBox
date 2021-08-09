var mongoose = require("mongoose");

var ScanSchema = new mongoose.Schema({
	method: {type: String, required: true,index:{unique: true, dropDups: true}},
    blockNumber:  {type: Number, required:true, default: 0},
}, {timestamps: true});


module.exports = mongoose.model("Scan", ScanSchema);