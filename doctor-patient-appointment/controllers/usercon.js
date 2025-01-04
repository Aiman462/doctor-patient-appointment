import User from "../schemas/userschema.js";

let Usercontroller={
    create: async(req,res)=>{
        try{
            const user=new User({...req.body});
            await user.save();
            res.status(201).send({ message:"User created", user});
        }catch(error){


            
            res.status(400).send({ message:"Error creating user", error});
        }
    }
};

export default Usercontroller;