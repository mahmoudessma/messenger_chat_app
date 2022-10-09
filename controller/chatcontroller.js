const Chat = require("../models/chat");
const User = require("../models/User");

// one t one chat
module.exports.accessChat = async (req, res)=>{
    const {userId} = req.body
    if(!userId ){
        console.log('UserId param not sent with request')
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat :false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users" ,"-password").populate("latestMessage")

    isChat=await User.populate(isChat , {
        path:"latestMessage.sender",
        select :"fname pic email"
    });
    if(isChat.length >0)
    {
        res.send(isChat[0])
    }
    else{
        var ChatData = {
            chatName :"sender",
            isGroupChat:false,
            users:[req.user._id , userId]
        }

        try{
            const createdChat = await Chat.create(ChatData);
            const Fullchat = await Chat.findOne({_id:createdChat._id}).populate("users" , "-password")
            res.status(200).send(Fullchat)
        }
        catch(error){
            res.status(400);
            throw  new Error(error.message);
        }
    }
    
}


module.exports.fetchchat = async (req , res)=>{

try{
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate("users" , "-password")
    .populate("groupAdmin" , "-password")
    .populate("latestMessage")
    .sort({updatedAt:-1})
    .then(async(result)=>{
        result = await User.populate(result,{
            path:"latestMessage.sender",
            select:"fname pic email"
        })
        res.status(200).send(result)
    })
}
catch(error){
    res.status(400);
    throw new Error(error.message)
}
}

module.exports.groupChat= async (req , res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    
      var users = JSON.parse(req.body.users);
    
      if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
      users.push(req.user);
    
      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    };   

    module.exports.rename = async(req , res)=>{

        const {chatId , chatName} = req.body;

        const updategroup = await Chat.findByIdAndUpdate(
            chatId,{
                chatName,
            },{
                new :true
            })
            .populate("users","-password")
            .populate("groupAdmin","-password")
            if (!updategroup) {
                res.status(404);
                throw new Error("Chat Not Found");
              } else {
                res.json(updategroup);
              }
    }

    module.exports.add = async(req, res)=>{
        const {userId ,chatId} = req.body;

        const adduser = await Chat.findByIdAndUpdate(
            chatId , {
                $push: { users: userId },
            },{
                new :true
            })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        
          if (!adduser) {
            res.status(404);
            throw new Error("Chat Not Found");
          } else {
            res.json(adduser);
          }
    }

module.exports.remove = async(req, res)=>{
    const {userId ,chatId} = req.body;

    const remove = await Chat.findByIdAndUpdate(
        chatId , {
            $pull: { users: userId },
        },{
            new :true
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
      if (!remove) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(remove);
      }
}
