const mongoose=require("mongoose");

const findOrCreate = require("mongoose-findorcreate");

const userSchema=new mongoose.Schema({

name:{
    type:String,
    required:true,
    unique:false,
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:false,
    unique:false,
},
});

userSchema.plugin(findOrCreate);
const User=mongoose.model("User",userSchema);

module.exports=User;