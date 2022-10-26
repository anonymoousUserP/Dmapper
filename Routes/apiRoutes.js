const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const userInfo = require('../DB/db');
const validator = require('email-validator');
const bcrypt  = require('bcrypt');
require('dotenv').config({path:__dirname+'/../.env'})

const router = express.Router();

router.post('/login', async (req, res) => {

    const useremail = req.body.email;
    const password = req.body.password;
	const user = await userInfo.findOne({ email : useremail })

	if (!user) {
        return res.json({status : 'error', error: 'User does not exists.'}); 
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
		const token = jwt.sign(
			{
				id: user._id,
				username: user.name
			},
			process.env.JWT_SECRET
		)
		return res.json({ status: 'ok', data: token })
	}
	return res.json({ status: 'error', error: 'Invalid username/password' })
})

router.post('/emailCheck', async (req,res)=>{
	const email = req.body.email;

	const result = validator.validate(email); 
	res.json({result});
})

router.post('/register', async (req, res) => {

	const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
	const email = req.body.email;

	const user = await userInfo.findOne({ email : email })
	if(user){
		return res.json({status : 'error', error: 'Account already exists with that e-mail address.'}); 
	}
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
	}
	res.json({ status: 'ok' })
})

module.exports = router;