const mongoose = require('mongoose')

const auditModel = mongoose.Schema({
    auditAction:{type:String },
    data:{type:String },
    status:{type:String },
    error:{type:String },
    
    auditOn:{type:String },
    auditBy:{type:String },
   
},{
    timestamps:true
})

const Audit = mongoose.model("Audit" ,auditModel);
module.exports = Audit;