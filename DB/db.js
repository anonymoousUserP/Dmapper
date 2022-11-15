const mongoose = require('mongoose');
// connecting to the local mongodb server.
mongoose.connect("mongodb://localhost:27017/dMapperDb",()=>{
    console.log("connected to mongo database successfully.");
}, error => {
    console.error(error);
});

// defining the schema(specifying the table design)
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        maxLength : 30,
        validate : {
            validator : (value)=>{
                if(value.length >30)
                return false;
                return true;
            },
            message : (props)=>{
                return `Name should be less than 30`
            }
        },
        required : true
    },
    email : {
        type : String,
        maxLength : 30,
        trim : true,
        validate : {
            validator : (value)=>{
                // email validation code should be here
                if(value.length >30)
                return false;
                return true;
            },
            message : (props)=>{
                return 'Name should be less than 30';
            }
        },
        required : true
    },
    password : {
        type : String,
        minLength : 8,
        validate : {
            validator : (value)=>{
                // password validation validation should be herer
                if(value.length >300)
                return false;
                return true;
            },
            message : (props)=>{
                return 'Name should be less than 30';
            }
        },
        required : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => new Date(),
        required : true
    },
    updatedAt : {
        type : Date,
        default : () => new Date(),
        required : true
    }
}, { collection: 'userInfo' });


// shema for the feedback
const FeedBack = new mongoose.Schema({
    rating : {
        type : Number,
        validate : {
                validator : (value)=>{
                if(value > 5 || value < 1)
                return false;
                return true;
            }
        }
    },
    feedBackText : {
        type : String,
        validate : {
            validator : (value) => {
                if(value.length > 300){
                    return false;
                }
                return true;
            },
            message : (props)=>{
                return 'The text size should be less than 300 character';
            }
        },
    },
    checked : {
        type : Number
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => new Date(),
        required : true
    }
},{collection: 'feedbackTable'});

const feedBack = mongoose.model("feedback", FeedBack);

userSchema.methods.sayHi = function(){
    console.log(`${this.name} is saying Hii...!!`);
}

// Finding by the name.
userSchema.statics.findByName = function(name){
    return this.where({ name: new RegExp(name,'i')});
}

// Findning by name using query.
userSchema.query.ByName = function(name){
    return this.where({name: new RegExp(name,'i')});
}

userSchema.virtual('namedEmail').get(function(){
    return `${this.name} has the email ${this.email}`
});

// Pre and post for before and after.
userSchema.pre('save', function(next){
    this.updateAt = Date.now();

    console.log(`${this.name}'s Data update`);
    // Move to the next peice of code.
    next();
});
// JOV -> jwtOtpV

const jwtOtpVSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    }
})

const jwtOtpV = mongoose.model("jwtOtpV",jwtOtpVSchema);

// Defining the userInfo model in the database.
const userInfo =  mongoose.model("UserInfo",userSchema); 

module.exports = {userInfo,jwtOtpV,feedBack};