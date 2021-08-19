var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TokenIdSchema = new Schema({
	tokenID: {type: String, required: true,index:{unique: true, dropDups: true}},
	address: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("TokenId", TokenIdSchema);