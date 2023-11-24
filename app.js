require('dotenv').config();
const express= require ("express");
const session = require("express-session"); 
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {createServer} = require("http");
const {Server} = require("socket.io");

const connectDB = require("./config/db");

const teamRoutes = require("./routes/teamRoutes.js");
const userRoutes=require("./routes/userRoutes.js");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({
    extended: true
  }));

  const passport=require("passport");
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  
  const User=require("./models/userModel");  
  const{send_mail_registration}=require("./controllers/mailController");
  const{isUserPresent}=require("./controllers/userController");
  app.use("/team",teamRoutes);
  app.use("/user",userRoutes);
  app.use(session({
    secret: process.env.SECRET_KEY_SESSION, 
    resave: false,
    saveUninitialized: false
  }));
  
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.URL}/auth/google/callback`,
  },
  function(accessToken, refreshToken, profile, cb) {

        User.findOrCreate({
        name: profile.displayName,
        email: profile.emails[0].value,
        },
        function(err, user) {
        return cb(err, user);
      });
  }
));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, cb) {
    cb(null, user); 
  });
  
  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

app.get("/googleOAuth", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/register",
  failureRedirect: "/error",
}));

app.get("/error",async(req,res)=>{
    return res.json("Error while verifying user");
  });

  app.get("/register",(req,res)=>{
    if(req.isAuthenticated()){
        const user=req.user;
        const email=user.email;
        const name=user.name;
        send_mail_registration(email,name);
    

    return res.json("User entered successfully!");
    
  
    }else{
      return res.status(401).json("Please signup first");
    }
  }); 








const PORT = process.env.PORT || 4000;

app.route("/").get((req, res) => {
    res.json({message: "Hello World"});
})


app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})
