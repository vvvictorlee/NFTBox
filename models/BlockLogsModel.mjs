import mongoose from "mongoose";

var Schema = mongoose.Schema;

var BlockLogsSchema = new Schema(
  {
    address: { type: String },
    topics: { type: Array },
    data: { type: String },
    blockNumber: { type: String },
    timeStamp: { type: String },
    gasPrice: { type: String },
    gasUsed: { type: String },
    logIndex: { type: String },
    transactionHash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    transactionIndex: { type: String },
  },
  { timestamps: false,versionKey:false }
);

export default mongoose.model("BlockLogs", BlockLogsSchema);
