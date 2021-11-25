import mongoose from "mongoose";

var Schema = mongoose.Schema;

var UserBlockLogsSchema = new Schema(
  {
    address: { type: String, required: true },
    timeStamp: { type: String, required: true },
    gasPrice: { type: String, required: true },
    gasUsed: { type: String, required: true },
    transactionHash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    eventName: { type: String, required: true },
  },
  { timestamps: false }
);

export default mongoose.model("UserBlockLogs", UserBlockLogsSchema);
