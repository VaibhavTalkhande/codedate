const mongoose = require('mongoose');


//connect to database;
const uri = process.env.URI;

const connectDB = async()=>{
    try{
        await mongoose.connect(uri);
        console.log("Connected to database");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {connectDB};