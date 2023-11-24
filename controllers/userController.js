require("dotenv").config()
const User = require('../models/userModel.js');
const {send_mail_registration,send_mail_OTP}=require("./mailController");
const{setUser,getUser}=require("../middleware/auth");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const axios = require("axios");

async function handleUserSignup(req, res) {

    const body = req.body;
    /*const Response = req.body["g-recaptcha-response"];
    const secretkey = process.env.SECRET_KEY;
    const verify = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${Response}`;
    try {
        const response = await axios.post(verify);
        console.log("success:", response.data);
        if (!response.data.success) {
            res.json("Couldn't verify reCAPTCHA");
            return;
        }
    }
    catch (error) {
        console.log("error in captcha:", error);
        res.json("Error verifying reCAPTCHA");
        return;
    }*/
    const user = {
        name: body.name,
        email: body.email,
        password: body.password,
        isLoggedIn:"No",      
    }
    
    const result=await User.findOne({"email":user.email});
    if(result){
        return res.json("Email already exists");
    };

    if(!user.password){
        return res.status(400).json("Please enter password");
    }
    if(!user.email){
        return res.status(400).json("Please enter email");
    }
    if(!user.name){
        return res.status(400).json("Please enter name");
    }     
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
            res.status(500).json("Couldn't generate salt");
        } else {

            bcrypt.hash(user.password, salt, async (hashErr, hash) => {
                if (hashErr) {
                    res.status(500).json("Couldn't hash password");
                } else {

                    user.password = hash;

                    try {
                        const result = await User.create(user);
                        send_mail_registration(user.email,user.name);
                        console.log("finaluser:", result);
                        return res.json("Signup Successfull!");

                    } catch (dbError) {
                        res.status(500).json("Database error");
                    }
                }
            });
        }
    });
};

async function handleUserLogin(req,res){
    try{
    const body=req.body;
    const email=body.email;
    const password=body.password;

    if(!password){
        return res.status(400).json("Please enter password");
    }

    if(!email){
        return res.status(400).json("Please enter email");
    }

    
        const user = await User.findOne({ "email":email });
        console.log("user:",user);
        if (!user){
            
        return res.status(400).json("No such user found")}//or redirect to signup
        const Password=user.password;

        const isPasswordValid = await bcrypt.compare(password, Password);
        if (isPasswordValid) {
            user.isLoggedIn="Yes";
            user.save();
            const token = setUser(user);
            
            return res.json(token); 
            
        } else {
            res.status(401).json("Incorrect Password");
        }
    }catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}



module.exports={handleUserSignup,handleUserLogin};

