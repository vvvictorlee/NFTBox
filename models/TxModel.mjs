import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var TxSchema = new Schema(
  {
    blockNumber: { type: String },
    timeStamp: { type: String },
    hash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    nonce: { type: String },
    blockHash: { type: String },
    transactionIndex: { type: String },
    from: { type: String },
    to: { type: String },
    value: { type: String },
    gas: { type: String },
    gasPrice: { type: String },
    isError: { type: String },
    txreceipt_status: { type: String },
    contractAddress: { type: String },
    cumulativeGasUsed: { type: String },
    gasUsed: { type: String },
    confirmations: { type: String },
  },
  { timestamps: false,versionKey:false }
);



export default  mongoose.model("Tx", TxSchema);
