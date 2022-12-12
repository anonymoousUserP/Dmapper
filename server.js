const express = require("express");
const router = require('./Routes/apiRoutes');
const logger = require('./Log/log');

require('dotenv').config()
const path = require("path");
PORT = process.env.port

// Initiallizing the express server.
const app = express();

// so that our app will be able to use json.
app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', "*");	
	next();
})




// Rendering the index.html which will be having the login logout html file.
app.use('/', express.static(path.join(__dirname, '/static')))

app.use('/api', router);

// Listen to the request made.
app.listen(PORT, ()=>{
	console.log(`server started on port ${PORT}`);
});