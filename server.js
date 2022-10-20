const express = require("express");
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

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
	// const user = await User.findOne({ username }).lean()

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

	res.json({ status: 'error', error: 'Invalid username/password' })
})



app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

// Listen to the request made.
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});