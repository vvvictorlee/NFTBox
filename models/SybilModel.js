var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SybilSchema = new Schema({
	address: {type: String, required: true,index:{unique: true, dropDups: true}},
}, {timestamps: true});

module.exports = mongoose.model("Sybil", SybilSchema);