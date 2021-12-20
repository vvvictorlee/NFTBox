import mongoose from "mongoose";

var Schema = mongoose.Schema;

var UserBlockLogsSchema = new Schema(
  {
    address: { type: String },
    timeStamp: { type: String },
    gasPrice: { type: String },
    gasUsed: { type: String },
    transactionHash: {
      type: String,
      required: true,unique:true,dropDups: true
    },
    eventName: { type: String },
  },
  { timestamps: false,versionKey:false }
);

export default mongoose.model("UserBlockLogs", UserBlockLogsSchema);
