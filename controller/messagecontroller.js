const { loggers } = require("winston");
const  {auditAction}  = require("../audit/auditAction");
const  audit  = require("../audit/audit");
const Chat = require("../models/chat");
const Message = require("../models/Message");
const User = require("../models/User");
const LoggerService = require("../services/logger.service");
const ApiError = require("../utilits/ApiError");



const logger = new LoggerService('messagecontroller')

const dateformat =()=>{
  return new Date(Date.now()).toLocaleString();
}
module.exports.allmessage = async (req, res , next)=>{
    try{
        var messages = await Message.find({chat :req.params.chatId})
        .populate("sender" , "fname pic email")
        .populate("chat")
        
        messages = await User.populate(messages ,{
            path:"chat.users",
            select:"fname email"
        });
        logger.info("return data" , messages)
        audit.prepareAudit(auditAction.GET_ALL_MESSAGES , JSON.stringify( messages ) ,"postman" , null , dateformat())
        res.json(messages);
        
  } catch (error) {
    
    let errormessage = "failed to get messages + error";
    audit.prepareAudit(auditAction.GET_ALL_MESSAGES ,null,"postman" , JSON.stringify( errormessage ) , dateformat())
    next(new ApiError(`chat_id is wrong :${req.originalUrl}` ,404))

  }
}


module.exports.sendMessage = async (req, res)=>{
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        
        return next(new ApiError(`Invalid data passed into request to send message :${req.originalUrl}` ,404))
      
      }

      var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };
    try{
        
          var messages = await Message.create(newMessage)
          messages = await messages.populate("sender", "fname pic")
          messages = await messages.populate("chat")
          messages = await User.populate(messages, {
            path: "chat.users",
            select: "fname pic email",
          });
          messages = await User.populate(messages, {
            path: "chat.groupAdmin",
            select: "fname email",
          });
      
          await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: messages });
      
          res.json(messages);
        } catch (error) {
          next(new ApiError(`Invalid data passed into request to send message :${req.originalUrl}` ,404))
      
          
        }
    }
    

