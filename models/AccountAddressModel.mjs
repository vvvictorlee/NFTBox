import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var AccountAddressSchema = new Schema(
  {
    AccountAddress: { type: String ,required: true,unique:true,dropDups: true},
},
  { timestamps: false }
);


export default  mongoose.model("AccountAddress", AccountAddressSchema);
