import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var ContractSchema = new Schema(
  {
    contractAddress: { type: String ,required: true,unique:true,dropDups: true},
},
  { timestamps: false }
);



export default  mongoose.model("Contract", ContractSchema);
