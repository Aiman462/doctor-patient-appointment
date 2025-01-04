import User from "../schemas/userschema.js";

let Usercontroller={
    create: async(req,res)=>{
        try{
            const user=new User({...req.body,confirmtoken:req.headers.authorization,Token:"user123"});
            await user.save();
            res.status(201).send({ message:"User created", user});
        }catch(error){
            res.status(401).send({ message:"you are unauthorized", error});
        }
    }
};

export default Usercontroller;