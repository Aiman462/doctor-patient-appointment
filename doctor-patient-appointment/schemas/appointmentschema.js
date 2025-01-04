import mongoose from "mongoose";

const appointmentSchema= new mongoose.Schema({
     Name:{type:String , required:true},
     Age:{type:Number , required:true},
     Time:{type:Number , required:true},
     Description:{type:String , required:true},
     Contact:{type:Number , required:true},
     Price:{type:Number , required:true},
     Status:{type:String ,enum:["completed","accepted","cancelled","requested"], required:true},
     DoctorId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required :"true"},
     PatientId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required :"true"},

});

const Appointment= mongoose.model("Appointment",appointmentSchema,"appointments");

export default Appointment;