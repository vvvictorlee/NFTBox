import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var UserTokenTxSchema = new Schema(
  {
    blockNumber: { type: String },
    timeStamp: { type: String },
    hash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    nonce: { type: String },
    blockHash: { type: String },
    from: { type: String },
    contractAddress: { type: String },
    to: { type: String },
    value: { type: String },
    tokenName: { type: String },
    tokenSymbol: { type: String },
    tokenDecimal: { type: String },
    transactionIndex: { type: String },
    gas: { type: String },
    gasPrice: { type: String },
    gasUsed: { type: String },
    cumulativeGasUsed: { type: String },
    input: { type: String },
    confirmations: { type: String },
  },
  { timestamps: false,versionKey:false }
);



export default  mongoose.model("UserTokenTx", UserTokenTxSchema);
