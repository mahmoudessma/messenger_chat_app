const Person = require('../models/person')

module.exports.insert= async(req, res)=>{
    const {fname , lname , position} = req.body;
    if(!fname || !lname || !position)
    {
        res.status(400).json('you must fill the fields')
    }
    const person = await Person.create({fname , lname , position})
    res.status  (200).json('done')

}