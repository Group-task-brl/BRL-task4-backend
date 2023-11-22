require('dotenv').config();
const express= require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {createServer} = require("http");
const {Server} = require("socket.io");

const connectDB = require("./config/db");

const teamRoutes = require("./routes/teamRoutes.js");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({
    extended: true
  }));



  app.use("/team",teamRoutes);






const PORT = process.env.PORT || 4000;

app.route("/").get((req, res) => {
    res.json({message: "Hello World"});
})


app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})
