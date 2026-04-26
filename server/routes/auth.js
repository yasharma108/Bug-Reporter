const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const User=require("../models/User");
const jwt=require("jsonwebtoken");


router.post("/signup", async(req, res)=>
{
    try{
        const{email, password}=req.body;

        if (!email?.trim() || !password?.trim()) 
        {
            return res.status(400).json({ message: "All fields are required" });
        }
        let user=await User.findOne({email});
        if(user)
        {
            return res.status(400).json({message:"User already exists"});

        }
        const hashedPassword=await bcrypt.hash(password, 10);
        user=new User({
            email,
            password:hashedPassword
        });
        await user.save();
        res.status(201).json({message: "User registered successfully"});
    }catch(err)
    {
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
});


router.post("/login", async(req, res)=>
{
    try{
        const{email, password}=req.body;

        if(!email || !password)
        {
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"Invalid Credentials"});

        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token=jwt.sign(
            {userId:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"}
        );
        res.json({token});

    }
    catch(err)
    {
        console.error("LOGIN ERROR", err.message);
        console.error(err.stack);
        res.status(500).json({message:"Server Error"});
    }
});

module.exports=router;