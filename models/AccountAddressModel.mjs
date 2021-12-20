import mongoose from "mongoose";

var Schema = mongoose.Schema;

var AccountAddressSchema = new Schema(
  {
    accountAddress: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
  },
  { timestamps: false, versionKey: false }
);

export default mongoose.model("AccountAddress", AccountAddressSchema);
