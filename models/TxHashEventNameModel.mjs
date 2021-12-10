import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var TxHashEventNameSchema = new Schema(
  {
    transactionHash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    eventName: { type: String, required: true },
  },
  { timestamps: false,versionKey:false }
);

export default  mongoose.model("TxHashEventName", TxHashEventNameSchema);
