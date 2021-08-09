var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BadgeSchema = new Schema({
	address: {type: String, required: true,index:{unique: true, dropDups: true}},
	tokenID: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Badge", BadgeSchema);