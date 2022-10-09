const express = require('express')
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const person = require('./router/person.router')
app.use('/person',person)

const user = require('./router/user.router')
app.use('/user',user)

const chat = require('./router/chat.router')
app.use('/chat',chat)

const message = require('./router/message.router')
app.use('/message',message)

app.get('/',(req, res)=>{
res.send('done')
})

mongoose.connect('mongodb://localhost:27017/mongo').then(()=>{
    app.listen(5000 , ()=>{
        console.log('connected to server and db' , 5000)
    })
}).catch((error)=>{
    console.log(error)
  })