const mongoose = require('mongoose')
const util = require('util');
const redis = require('redis')
// const redisUrl = 'redis://127.0.0.1:6379'  this is ok for dev
const keys = require('../config/keys')
const client = redis.createClient(keys.redisUrl);
client.get= util.promisify(client.get);
//we are going to overwrite a standard mongoose function 
//create a copy of the original function
const exec = mongoose.Query.prototype.exec

//we add a new function to the Qeury prototype that allow us to decide if use cache or not
mongoose.Query.prototype.cache = function(){
    //remember the 'this' here is equal to the query istance created every time 
    this.useCache= true
    return this;
}

//not using arrow function because of 'this' keyword binding
mongoose.Query.prototype.exec = async function(){
    
    
    if(!this.useCache){
        return exec.apply(this, arguments)
    }
    
    const key = JSON.stringify(
        Object.assign({},this.getQuery(),{
        collections:this.mongooseCollection.name
    }))
    
    const cachedValue = await client.get(key)
    //check if we have value for 'key' in redis 
    //if yes return it 
    if(cachedValue){
        
        //this value need to be turn into a mongoose document in order to be valid for mongoose to return it
        //create a new istance of the mongoose function "model"
        let doc =  JSON.parse(cachedValue)
        
        //check if cached value is an single object or an array of objects
        return Array.isArray(doc)
        ?  doc.map(document=> new this.model(document)) 
        : new this.model(doc)    
        
    }
    
    //Otherwise issue the query and store result in redis
    const result = await exec.apply(this,arguments)
    
    client.set(key,JSON.stringify(result),'EX',10)
    
    //
    
    return result;
}




