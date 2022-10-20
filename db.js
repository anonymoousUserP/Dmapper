const mongoose = require('mongoose');
// connecting to the local mongodb server.
mongoose.connect("mongodb://localhost:27017",()=>{
    console.log("connected to mongo server successfully.");
}, error => {
    console.error(error);
});


