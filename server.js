const express = require("express");
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const userInfo = require('./db');
const validator = require('email-validator');

// Defining the stucture of the table or here schema.

// const encode = require('./Controller/encryp');
require('dotenv').config()
const path = require("path");
PORT = 3500 || process.env.port

// Initiallizing the express server.
const app = express();

// so that our app will be able to use json.
app.use(express.json());

// Rendering the index.html which will be having the login logout html file.
app.use('/', express.static(path.join(__dirname, '/static')))

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'Views', 'index.html'))
// });

app.post('/api/login', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
	const user = await userInfo.findOne({ name : username })

	if (!user) {
        return res.json({status : 'error', error: 'User does not exists.'}); 
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		return res.json({ status: 'ok', data: token })
	}

	return res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/emailCheck', async (req,res)=>{
	const email = req.body.email;
	console.log(email);

	const result = validator.validate(email); 
	res.json({result});
})

app.post('/api/register', async (req, res) => {

	const username = req.body.username;
    const password = req.body.password;
	const email = req.body.email;

	const User = {
		name : username,
		password : password,
		email : email,
		createdAt : new Date(),
		updatedAt : new Date()
	}

	try {
		const response = await userInfo.create(User);
		console.log('User created successfully: ', response);
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		console.log(error.message);
		return res.json({status : 'error',message : error.message});
		// throw error
	}
	res.json({ status: 'ok' })
})

// Listen to the request made.
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});