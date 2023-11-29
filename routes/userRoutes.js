const express = require("express");
const router = express.Router();

const handleUserSignup = require("../controllers/userController.js").handleUserSignup;
const handleUserLogin = require("../controllers/userController.js").handleUserLogin;
const resetPassword = require("../controllers/userController.js").resetPassword;
const verifyOTP = require("../controllers/userController.js").verifyOTP;
const newPassword = require("../controllers/userController.js").newPassword;
const sendMessage= require("../controllers/userController.js").sendMessage;



router.post("/signup",handleUserSignup);

router.post("/login",handleUserLogin);

router.post("/resetPassword",resetPassword);

router.post("/verifyOTP/:email",verifyOTP);

router.post("/newPassword/:email",newPassword);

router.post("/sendMessage/:teamId",sendMessage);


module.exports=router;

