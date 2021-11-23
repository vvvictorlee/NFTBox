import mongoose from "mongoose";

var Schema = mongoose.Schema;

var BlockLogsSchema = new Schema(
  {
    address: { type: String, required: true },
    topics: { type: Array, required: true },
    data: { type: String, required: true },
    blockNumber: { type: String, required: true },
    timeStamp: { type: String, required: true },
    gasPrice: { type: String, required: true },
    gasUsed: { type: String, required: true },
    logIndex: { type: String, required: true },
    transactionHash: {
      type: String,
      required: true,
    },
    transactionIndex: { type: String, required: true },
  },
  { timestamps: false }
);

export default mongoose.model("BlockLogs", BlockLogsSchema);
