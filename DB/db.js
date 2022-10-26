const mongoose = require('mongoose');
// connecting to the local mongodb server.
mongoose.connect("mongodb://localhost:27017/dMapperDb",()=>{
    console.log("connected to mongo database successfully.");
}, error => {
    console.error(error);
});

// Module is the actual individual database object that we use in the

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
    email : {
        type: String,
        require : true,
        lowercase : true,
        minLength : 10,
        maxLength : 30,
        trim : true,
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

// Defining the userInfo model in the database.
const user =  mongoose.model("UserInfo",userSchema); 

module.exports = user;