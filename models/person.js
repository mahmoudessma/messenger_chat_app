const mongoose =  require('mongoose')
const Schema = mongoose.Schema;

const personSchema = new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String ,
        required:true
    }
    ,position:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


module.exports=mongoose.model('Person' , personSchema);