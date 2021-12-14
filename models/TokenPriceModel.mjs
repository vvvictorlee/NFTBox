import mongoose from "mongoose";

var Schema = mongoose.Schema;

var TokenPriceSchema = new Schema(
  {
    contractAddress: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    price: { type: String },
    lastUpdateTime: { type: String },
  },
  { timestamps: false,versionKey:false }
);

export default mongoose.model("TokenPrice", TokenPriceSchema);
