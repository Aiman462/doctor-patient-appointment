import express from "express";
import Appointmentcon from "../controllers/appointmentcontroller.js";

const appointment=express.Router();

// appointment.post("/:id/create",Appointmentcon.create );
appointment.post("/:id/create",Appointmentcon.create );
appointment.get("/:id/getAll" , Appointmentcon.getAll);
appointment.get("/:id/getAccepted" , Appointmentcon.getAccepted);
appointment.get("/:id/getCompleted" , Appointmentcon.getCompleted);
appointment.get("/:id/getCancelled" , Appointmentcon.getCancelled);
appointment.get("/:id/getRequested" , Appointmentcon.getRequested);
appointment.put("/:id/reschedule" , Appointmentcon.reschedule);
appointment.put("/:id/updateRescheduled" , Appointmentcon.updateRescheduled);

export default appointment;