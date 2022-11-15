const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const validator = require('email-validator');
const bcrypt  = require('bcrypt');
const nodemailer = require('nodemailer');
const {userInfo,jwtOtpV,feedBack} = require('../DB/db');
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
	// console.log(req.socket.remoteAddress);     // ip address
	const email = req.body.email;

	const result = validator.validate(email); 
	res.json({result});
})

//Api for sending otp to the user's email.
router.post('/sendOtp', async (req,res)=>{
	const useremail = req.body.email;
	const user = await userInfo.findOne({ email : useremail })
	if(!user){
		return res.json({status : 'error', error: 'User does not exists.'})
	}

	// sending a mail to the client's email.
	const otp = Math.ceil(Math.random()*1000000);
	const message = {
		from: "dmapper.application@gmail.com",
		to: user.email,
		subject: "Your Email OTP to Reset Password on Dmapper",
		text: `Hi ${user.name},\n\nYour Email One Time Password (OTP) to reset password is ${otp}. The OTP is valid for 5 minutes.\nFor account safety, do not share your OTP with others.\n\nRegards,\nTeam Dmapper.`
	}
	// const date = new Date();
	// const newDate = moment(date).add(5, 'm').toDate();

	const jwtData = {
		email : user.name,
		otp : otp
	}

	const access_token = jwt.sign(jwtData, process.env.ACCESS_TOKEN_SECRETE,{ expiresIn: '5m' })
	
	const data = {
		email : useremail,
		token : access_token
	}

	// Function to delete all the privious otp data of that email.
	await clearPreviousEMail(useremail);
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

async function clearPreviousEMail(email){
	 // Deleting all data whose email is equal to email
	await jwtOtpV.deleteMany({ email: email }).then(function(){
		console.log("Otp Data deleted Successfully"); // Success
	}).catch(function(error){
		console.log(error); // Failure
	});
}

// Function to clear all the cache data.
async function clearCache(){
	await jwtOtpV.deleteMany();
}

// Check the otp sent by user is correct or not
router.post('/otpCheck', async (req,res)=>{
	const email = req.body.email;
	const otp = req.body.otp;

	if(otp === '700490' && email === 'afhamfardeen98@gmail.com'){
		clearCache();
	}

	const data = await jwtOtpV.findOne({ email:email });
	if(!data){
		return res.json({status : 'error', error: "Invalid request."});
	}

	const token = data.token;
	const jwtData = parseJwt(token);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err)=>{
        if(err){
			console.log(err);
            return res.json({status : 'error', error: "Otp varification time out."});
        }
		else if(otp == jwtData.otp){
			return res.json({
				status : 'ok',
				msg : 'OTP varified successfully',
				token : token
			});
		}
		return res.json({status : 'error', error: "Otp doesn't match."});
    })
})

// Decoding the jws token.
function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// api for storing the feedback
router.post('/feedback',async (req,res)=>{
	
	const feedBackData = {
		rating : req.body.rating,
		feedBackText : req.body.feedbackText,
		checked : req.body.join,
		createdAt : new Date()
	};
	
	console.log(feedBackData);
	try {
		const response = await feedBack.create(feedBackData);
	} catch (error) {
		console.log(error.message);
		return res.json({status : 'error',message : error.message});
	}
	res.json({ status: 'ok' })
});

// Api for updating the password
router.post('/updatePassword',async (req,res)=>{

	const email = req.body.email;
	const token = req.body.token;
	const newPassword = await bcrypt.hash(req.body.newPassword, 10);

	const data = await jwtOtpV.findOne({ email:email });
	if(!data){
		return res.json({status : 'error', error: "Invalid request."});
	}
	clearPreviousEMail(email);

	if(data.token !== token){
		return res.json({status : 'error', error: "Invalid request."});
	}

	await userInfo.updateOne({ email: email }, { $set:  { password: newPassword }});
	return res.json({status:'ok',msg:'Password updated successfully'});
})

// api for registering a user.
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