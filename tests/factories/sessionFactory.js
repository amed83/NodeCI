const Buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip')
const keys = require('../../config/keys')
const keygrip = new Keygrip([keys.cookieKey]);

module.exports =user=>{
    const sessionObject={
        passport:{
            user:user._id.toString() //we need to convert to a string because user._id is a Mongo Object
        }
    }
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const signature = keygrip.sign('session=' + session)
    //create an object to return both sessio and signature
    return {
        session,
        signature
    }
}