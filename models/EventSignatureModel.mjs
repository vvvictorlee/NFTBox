import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var EventSignatureSchema = new Schema(
  {
    eventName: { type: String },
    eventSignature: { type: String,unique:true,dropDups: true },
  },
  { timestamps: false,versionKey:false }
);

export default  mongoose.model("EventSignature", EventSignatureSchema);
