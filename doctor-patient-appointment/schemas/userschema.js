import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
     Name:{type:String , required:true},
     Age: {type:Number , required:true},
     Profile:{type:String , enum:["patient","doctor"], required:true},

});

const User= mongoose.model("User",userSchema,"users");

export default User;