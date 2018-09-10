const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports=()=>{
    //create an empty user becuase we just need the _id which is created automatically by Mongo
    return  new User({}).save();    
    
}