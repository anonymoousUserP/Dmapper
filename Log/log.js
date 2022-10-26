const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const path = require('path');
const fsPromise = require('fs/promises');

// Middleware function which will function as logger.
const logger = async (req,res,next) =>{
    const dateTime = `${format(new Date(), 'dd-MM-yyyy \t HH:mm:ss')}`
    const url = `${req.method}\t${req.protocol}://${req.get('host')}${req.url}`;

    const message = `${uuid()} \t ${dateTime} \t ${url}\n`;
    
    try{        
        await fsPromise.appendFile(path.join(__dirname,'eventLogs.txt'),message);
    }catch(err){
        console.log('Some error detected');
        console.log(err);
    }
    next();
}

module.exports = logger