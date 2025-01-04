import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
     Name:{type:String , required:true},
     Age: {type:Number , required:true},
     Profile:{type:String , enum:["patient","doctor"], required:true},
     Token:{type:String , required:true},
     confirmtoken:{type:String , required:true,
        validation:{
            validator: function(value){
                value===this.Token
            }
        }
     }

});

const User= mongoose.model("User",userSchema,"users");

export default User;