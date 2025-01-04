import User from "../schemas/userschema.js";
import Appointment from "../schemas/appointmentschema.js";

let Appointmentcon={
    create:async(req,res)=>{
        try{
            const user= await User.findById(req.params.id);
            if(!user){
               return res.status(404).send({ message:"User not found"}); 
            }
            if(user.Profile !== "patient"){
               return res.status(403).send({ message:"Only Patient can create appointments"});  
            }
            const appointment= new Appointment(req.body);
            const {Date,Time}= req.body.Time;
            const currentDate= new Date();
            const appointmentDate=new Date(Date.UTC(`${Date} T ${Time}`));

            if(!Date||!Time){
               return res.status(400).send({message:" Appointment time and date is required."});
            }if(appointmentDate<currentDate){
              return  res.status(400).send({message:"Appointment Time is in the past.Enter time Again."});
            }
                await appointment.save();
               return res.status(201).send({ message:"Appointment created", appointment});
                
        }catch(error){
          return res.status(400).send({ message:"Error creating appointment", error});
        }
    }, 
    getAll: async(req,res)=>{
        try{
            const user= await User.findById(req.params.userId);
            if(!user){
               return res.status(404).send({ message:"User not found"}); 
            }
            if(user.Profile !== "doctor"){
                return res.status(403).send({ message:"Only Doctors can view appointments"});
            }
            const appointments= await Appointment.find({DoctorId: req.params.userId}).poulate("doctorId");
            if(!appointments){
               return  res.status(404).send({ message:"Appointments not found"}); 
            }
           return res.status(200).send({ message:"Appointments are:", appointments});
        } 
        catch(error){
           return res.status(400).send({ message:"Error fetching appointments", error});
        }
    },
    getRequested: async(req,res)=>{
      try{
          const user= await User.findById(req.params.userId);
          if(!user){
             return res.status(404).send({ message:"User not found"}); 
          }
          if(user.Profile !== "doctor"){
              return res.status(403).send({ message:"Only Doctors can view appointments"});
          }
          const appointments= await Appointment.find({DoctorId: req.params.userId ,Status:"requested"}).poulate("doctorId");
          if(!appointments){
             return  res.status(404).send({ message:"Appointments not found"}); 
          }
         return res.status(200).send({ message:" Requested Appointments are:", appointments});
      } 
      catch(error){
         return res.status(400).send({ message:"Error fetching appointments", error});
      }
  },
  getCancelled: async(req,res)=>{
   try{
       const user= await User.findById(req.params.userId);
       if(!user){
          return res.status(404).send({ message:"User not found"}); 
       }
       const appointments= await Appointment.find({...req.params.userId , Status:"cancelled"});
       if(!appointments){
          return  res.status(404).send({ message:"Appointments not found"}); 
       }
      return res.status(200).send({ message:"Cancelled Appointments are:", appointments});
   } 
   catch(error){
      return res.status(400).send({ message:"Error fetching appointments", error});
   }
},
   getCompleted: async(req,res)=>{
      try{
       const user= await User.findById(req.params.userId);
       if(!user){
          return res.status(404).send({ message:"User not found"}); 
       }
       const appointments= await Appointment.find({...req.params.userId , Status:"completed"});
       if(!appointments){
          return  res.status(404).send({ message:"Appointments not found"}); 
       }
         return res.status(200).send({ message:"Completed Appointments are:", appointments});
      } 
      catch(error){
        return res.status(400).send({ message:"Error fetching appointments", error});
      }
},
getAccepted: async(req,res)=>{
   try{
       const user= await User.findById(req.params.userId);
       if(!user){
          return res.status(404).send({ message:"User not found"}); 
       }
       if(user.Profile !== "doctor"){
           return res.status(403).send({ message:"Only Doctors can view appointments"});
       }
       const appointments= await Appointment.find({...req.params.userId , Status:"accepted"});
       if(!appointments){
          return  res.status(404).send({ message:"Appointments not found"}); 
       }
      return res.status(200).send({ message:"Accepted appointments are:", appointments});
   } 
   catch(error){
      return res.status(400).send({ message:"Error fetching appointments", error});
   }
},
updateStatus:async(req,res)=>{
   try{
      const user= await User.findById(req.params.userId);
       if(!user){
          return res.status(404).send({ message:"User not found"}); 
       }
       if(user.Profile !== "doctor"){
           return res.status(403).send({ message:"Only Doctors can change the status of appointments"});
       }
       const {name ,status}=req.body;
       if (!name|| !status) {
         return res.status(400).send({ message: "Appointment's name and status is required" });
       }
       const appointment= await Appointment.findOne({ Name: name});
       if(!appointment){
         return res.status(404).send({ message:"Appointment not found"}); 
       }
       if(status=="completed"){
         const { Date:date,Time:time ,Status:currentStatus}=appointment;
         const currentDate= new Date();
         const appointmentDate=new Date(Date.UTC(`${date} T${time}`));
         if(currentDate>appointmentDate){
            return res.status(403).send({ message:"Appointment's status cannot be edited to completed before scheduled time."});
         }
         if(currentStatus !=="accepted"){
            return res.status(403).send({ message:"Appointment's status cannot be edited to completed without being accepted first."});
         }
       }
         const changedStatus= await Appointment.updateOne({ Name:name}, {$set:{Status:status}});
         return res.status(200).send({ message:"Appointment's status has been changed.", changedStatus});
      
   } 
   catch(error){
      return res.status(400).send({ message:"Error fetching appointments", error});
   }
     
   },
  reschedule:async(req,res)=>{
      try{
         const user= await User.findById(req.params.userId);
          if(!user){
             return res.status(404).send({ message:"User not found"}); 
          }
          if(user.Profile !== "doctor"){
              return res.status(403).send({ message:"Only Doctors can change the status of appointments"});
          }
          const {name ,date ,time}=req.body;
          if (!name|| !date || !time) {
            return res.status(400).send({ message: "Appointment's name, date and time is required" });
          }
          const appointment= await Appointment.findOne({ Name: name});
          if(!appointment){
            return res.status(404).send({ message:"Appointment not found"}); 
          }
          const currentDate= new Date();
          const appointmentDate=new Date(Date.UTC(`${date} T ${time}`));

          if(appointmentDate<currentDate){
            return  res.status(400).send({message:"Appointment cannot be rescheduled to past time.Enter time Again."});
          }
        
            const rescheduledApp= await Appointment.updateOne({ Name:name}, {$set:{Date:date}}, {$set:{Time:time}});
            return res.status(200).send({ message:"Appointment's schedule has been changed.", rescheduledApp});
         
      } 
      catch(error){
         return res.status(400).send({ message:"Error fetching appointments", error});
      }

   },
   updateRescheduled:async(req,re)=>{
      try{
         const user= await User.findById(req.params.userId);
          if(!user){
             return res.status(404).send({ message:"User not found"}); 
          }
          if(user.Profile !== "patient"){
              return res.status(403).send({ message:"Only Patients can change the status of rescheduled appointments"});
          }
          const {name ,status}=req.body;
           if (!name || !status) {
           return res.status(400).send({ message: "Appointment's name and status is required" });
           }
           const appointment= await Appointment.findOne({ Name: name});
          if(!appointment){
           return res.status(404).send({ message:"Appointment not found"}); 
           }
           const changedStatus= await Appointment.updateOne({ Name:name}, {$set:{Status:status}});
           return res.status(200).send({ message:"Appointment's status has been changed.", changedStatus});
      
      } 
      catch(error){
         return res.status(400).send({ message:"Error fetching appointments", error});
      }

   }

};

export default Appointmentcon;