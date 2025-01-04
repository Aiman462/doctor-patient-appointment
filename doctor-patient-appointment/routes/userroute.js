import express from "express";
import Usercontroller from "../controllers/usercon.js";

const user=express.Router();

user.post("/create",Usercontroller.create );

export default user;