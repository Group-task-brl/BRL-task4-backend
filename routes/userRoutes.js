const express = require("express");
const router = express.Router();

const handleUserSignup = require("../controllers/userController.js").handleUserSignup;
const handleUserLogin = require("../controllers/userController.js").handleUserLogin;



router.post("/signup",handleUserSignup);

router.post("/login",handleUserLogin);

module.exports=router;

