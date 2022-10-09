const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require('validator')

const userSchema = mongoose.Schema(
  {
    fname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
    //   required: true,
      default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
    //   default: false,
    },
  },
  { timestaps: true }
);

userSchema.statics.signup =async function (fname ,email, password ,pic, isAdmin){
    const exists = await this.findOne({email});

    // validation
    
    

    if(exists)
    {
        throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password , salt)

    const user = await this.create({fname,email , password:hash ,pic, isAdmin })
    return user;
}

userSchema.statics.login=async function(email , password){

    // validation
    if(!email || !password)
    {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({email})

    if(!user)
    {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password , user.password);
    if(!match )
    {
        throw Error('incorrect password')
    }
    return user
}

const User = mongoose.model("User", userSchema);

module.exports = User;
