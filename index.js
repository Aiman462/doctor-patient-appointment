import express from "express";
import mongoose from "mongoose";
import user from "./doctor-patient-appointment/routes/userroute.js";
import appointment from "./doctor-patient-appointment/routes/appointment.js";

const app= express();
app.use(express.json());

const dbString= "mongodb://localhost:27017/";

mongoose.connect(dbString);

const connection= mongoose.connection;
connection.once( "connected" ,()=> console.log("database connected"));
connection.on( "error",(error)=> console.log("database not connected"));

app.use("/user",user);
app.use("/appointment",appointment);

app.listen(4044);
