import mongoose from "mongoose";

var Schema = mongoose.Schema;

var TokenContractInfoSchema = new Schema(
  {
    contractAddress: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    price: { type: String },
    priceSource: { type: String },
    priceSourceType: { type: String },
    lastUpdateTime: { type: String },
  },
  { timestamps: false }
);

export default mongoose.model("TokenContractInfo", TokenContractInfoSchema);
