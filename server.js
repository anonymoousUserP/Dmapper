const express = require("express");
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
// const encode = require('./Controller/encryp');
require('dotenv').config()
const path = require("path");
PORT = 3500 || process.env.port

// Initiallizing the express server.
const app = express();

// so that our app will be able to use json.
app.use(express.json());

// Rendering the index.html which will be having the login logout html file.
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Views', 'index.html'))
});

// Listen to the request made.
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});