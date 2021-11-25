import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var EventSignatureSchema = new Schema(
  {
    eventName: { type: String, required: true },
    eventSignature: { type: String, required: true,unique:true,dropDups: true },
  },
  { timestamps: false }
);

export default  mongoose.model("EventSignature", EventSignatureSchema);
