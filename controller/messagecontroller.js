const Chat = require("../models/chat");
const Message = require("../models/Message");
const User = require("../models/User");

module.exports.allmessage = async (req, res)=>{
    try{
        var messages = await Message.find({chat :req.params.chatId})
        .populate("sender" , "fname pic email")
        .populate("chat")
        
        messages = await User.populate(messages ,{
            path:"chat.users",
            select:"fname email"
        });
        
        res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}


module.exports.sendMessage = async (req, res)=>{
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
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
          res.status(400);
          throw new Error(error.message);
          
        }
    }
    

