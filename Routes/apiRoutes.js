const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const validator = require('email-validator');
const bcrypt  = require('bcrypt');
const nodemailer = require('nodemailer');
const {userInfo,jwtOtpV} = require('../DB/db');
const moment = require('moment');
const path = require('path')
require('dotenv').config({path:__dirname+'/../.env'})


const router = express.Router();
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

//Api for sending otp to the user's email.
router.post('/sendOtp', async (req,res)=>{
	const useremail = req.body.email;
	const user = await userInfo.findOne({ email : useremail })
	if(!user){
		res.json({status : 'error', error: 'User does not exists.'})
	}

	// sending a mail to the client's email.
	const otp = Math.ceil(Math.random()*1000000);
	const message = {
		from: "dmapper.application@gmail.com",
		to: user.email,
		subject: "Your Email OTP to Reset Password on Dmapper",
		text: `Hi ${user.name},\n\nYour Email One Time Password (OTP) to reset password is ${otp}. The OTP is valid for 5 minutes.\nFor account safety, do not share your OTP with others.\n\nRegards,\nTeam Dmapper.`
	}
	const date = new Date();
	const newDate = moment(date).add(5, 'm').toDate();

	const jwtData = {
		email : user.name,
		otp : otp
	}

	const access_token = jwt.sign(jwtData, process.env.ACCESS_TOKEN_SECRETE,{ expiresIn: '5m' })
	
	const data = {
		date : newDate,
		token : access_token
	}
	await jwtOtpV.create(data);

	transporter.sendMail(message, function(err, info) {
		if (err) {
		  return res.json({satus:'error',msg:err})
		} else {
		//   console.log(info);
			console.log('Otp sent successfully.')
		}
	})

	return res.json({status:'ok',msg:'OTP sent to the mail successfully'});
})

// Check the otp sent by user is correct or not
router.post('/otpCheck', (req,res)=>{
	const data = jwtOtpV.findOne({email:req.body.email});
	if(!data){
		return res.json({status : 'error', error: "Invalid request."})
	}
	const token = data.token;
	console.log('TOken :',data.token);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err,jwtRes)=>{
		console.log(jwtRes);
        if(err){
			console.log(err);
            return res.json({status : 'error', error: "Otp varification time out."});
        }
		else if(res.body.otp === jwtRes.otp){
			res.sendFile(path.join(__dirname,'../static/newPassword.html'))
			// return res.json({status:'ok',msg:'OTP varified successfully'});
		}
		return res.json({status : 'error', error: "Otp doesn't match."});
    })
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

	const username = req.body.name;
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
		console.log('User created successfully: ');
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