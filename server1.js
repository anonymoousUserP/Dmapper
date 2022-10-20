const express = require("express");
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
// const encode = require('./Controller/encryp');
require('dotenv').config()

port = process.env.port

// Initiallizing the express server.
const app = express();

// so that our app will be able to use json.
app.use(express.json());

app.get('/posts',authenticate,(req,res)=>{

    console.log("get request has been made.")
    console.log(req.user);
    res.json(posts.filter(post => post.name === req.user.name));
})

// Rendering the index.html which will be having the login logout html file.
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'Views', 'index.html'))
});

app.post('/login1',(req,res)=>{

    console.log("post request has been made to the server.");
    console.log(req.body.username);
    const userName = req.body.username;
    const user = {name : userName};
    // console.log(req.headers);

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE,{ expiresIn: '15s' })
    res.json({acess_token : access_token})
})

// Middleware function which will authenticate the token.
function authenticate(req, res, next){

    // Token will be comming froom the header and the format would be.
    // Bearer Token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token : ',token);

    if(token === null){
        res("TOken not found");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err,user)=>{
        if(err){
            res.send("Authentication failed");
            return res.sendStatus(403);
        }
        req.user = user;
        console.log(user)
        next();
    })
}

// Post request has been made to generate tokens.
app.post('/genToken',(req,res)=>{

    console.log("post request has been made to the server.");
    console.log(req.body);
    const userName = req.body.username;
    const user = {name : userName};
    // console.log(req.headers);

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE,{ expiresIn: '20s' })
    res.json({acess_token : access_token})
})


// Listen to the request made.
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});