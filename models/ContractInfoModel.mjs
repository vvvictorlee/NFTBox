import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var ContractInfoSchema = new Schema(
  {
    contractAddress: { type: String ,required: true,unique:true,dropDups: true},
    contractName: { type: String },
    appName: { type: String },
    appType: { type: String },
},
  { timestamps: false }
);



export default  mongoose.model("ContractInfo", ContractInfoSchema);
