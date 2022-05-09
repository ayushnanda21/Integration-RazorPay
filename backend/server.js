require("dotenv").config()
const express = require("express");
const mongoose  =require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path  = require("path");
const { v4: uuidv4 } = require('uuid');
const app = express();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true}, function(err){
    if(err){
        console.log(err);
    } else{
        console.log("Connecting... Database connected successfully")
    }
})




app.use(express.json());
app.use(helmet());
app.use(morgan("common"));




app.listen(process.env.PORT || 5000 , (req,res)=>{
    console.log("Backend server is running on port 5000 ")
    console.log(uuidv4())
})