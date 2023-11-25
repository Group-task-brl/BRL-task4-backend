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
isLoggedIn:{
    type:String,
    required:false,
    enum:["Yes","No"],
    default:"No", 
}
});


userSchema.plugin(findOrCreate);
const User=mongoose.model("User",userSchema);

module.exports=User;