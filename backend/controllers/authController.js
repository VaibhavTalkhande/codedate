const {User} = require('../db/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const signup = async(req,res)=>{
    const {name,email,password,profile,publicId} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);//this will generate a salt i,e a random string
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            profile,
            publicId,
        });
        await newUser.save();
        return res.status(201).json({message:"Signup successful",success:true});

    } catch (error) {
        return res.status(500).json({message:"Internal server error",success:false});
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist",success:false});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials",success:false});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        return res.status(200).json(
            {
                message:"Login successful",
                success:true,token,
                data:{
                    name:user.name,
                    email:user.email,
                    profile:user.profile,
                    publicId:user.publicId,
                    favourites:user.favourites,
                    disliked:user.disliked,
                }
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message,success:false});
    }
}

const checkAuth = async(req,res)=>{
    const reqId = req.id;
    try {
        const user = await User.findById(reqId).select("-password");//this will exclude password from the response
        if(!user){
            return res.status(400).json({message:"User does not exist",success:false});
        }
        return res.status(200).json({success:true,data:user});

    } catch (error) {
        return res.status(500).json({message:"Internal server error",success:false});
    }
}



module.exports = {signup,login,checkAuth};