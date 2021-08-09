var mongoose = require("mongoose");

var IPSchema = new mongoose.Schema({
	ip: {type: String, required: true,index:{unique: true, dropDups: true}},
}, {timestamps: true});


module.exports = mongoose.model("IP", IPSchema);