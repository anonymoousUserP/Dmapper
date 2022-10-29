const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const userInfo = require('../DB/db');
const validator = require('email-validator');
const bcrypt  = require('bcrypt');
const nodemailer = require('nodemailer');
const user = require('../DB/db');
require('dotenv').config({path:__dirname+'/../.env'})

const router = express.Router();
var otp = ''

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
    port: 465,
    secureConnection: false, // use SSL
	service: "Gmail",
	auth: {
		user: "dmapper.application@gmail.com",
		pass: "ziljvhjdktqmrtyd"
	},
    tls: {
        ciphers:'SSLv3'
    }
})


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

// a api for sending otp to the user's email.
router.post('/sendOtp', async (req,res)=>{
	const useremail = req.body.email;
	const user = await userInfo.findOne({ email : useremail })
	if(!user){
		res.json({status : 'error', error: 'User does not exists.'})
	}

	// sending a mail to the client's email.
	otp = Math.ceil(Math.random()*1000000);
	const message = {
		from: "dmapper.application@gmail.com",
		to: user.email,
		subject: "Your Email OTP to Reset Password on Dmapper",
		text: `Hi ${user.name},\n\nYour Email One Time Password (OTP) to reset password is ${otp}. The OTP is valid for 5 minutes.\nFor account safety, do not share your OTP with others.\n\nRegards,\nTeam Dmapper.`
	}

	transporter.sendMail(message, function(err, info) {
		if (err) {
		  console.log(err)
		} else {
		  console.log(info);
		}
	})

	return res.json({status:'ok',msg:'OTP sent to the mail successfully'});
})

// Check the otp sent by user is correct or not
router.post('/otpCheck', (req,res)=>{
	if(otp===req.body.otp){
		return res.json({status:'ok',msg:'OTP varified successfully'});
	}
	else{
		res.json({status : 'error', error: "OTP doesn't match."})
	}
})

// 
router.post('/updatePassword',(req,res)=>{
	if(otp===req.body.otp){
		user.updateOne({email:req.body.email})
		return res.json({status:'ok',msg:'Password updated successfully'});

	}
	return res.json({status:'error',msg:'some mischief have been done'});	
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