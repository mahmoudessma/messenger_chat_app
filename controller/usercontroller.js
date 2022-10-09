const User = require('../models/User');
const jwt = require('jsonwebtoken')


const createtoken=(_id)=>{
    return jwt.sign({_id}, 'mahmoud', {expiresIn:'3d'})
}
module.exports.register = async(req , res)=>{
const {email , password  , fname , isAdmin , pic }= req.body;

try{
    const user = await User.signup(fname  ,email, password ,pic,  isAdmin)

        const token = createtoken(user._id)

        res.status(200).json({email , token})
}
catch(error)
{
    res.status(404).json({error:error.message})
}
}

module.exports.login = async (req , res)=>{

    const {email, password}= req.body;

    try{
        const user = await User.login(email, password)

        const token = createtoken(user._id)

        res.status(200).json({email , token})
    }
    catch(error)
    {
        res.status(400).json({error:error.message})

    }
}