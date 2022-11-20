const contentType = require('content-type')
const express = require('express')
const getRawBody = require('raw-body')

const app = express();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');



// to use json
app.use(express.json());

app.use(function (req, res, next) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '5.9 kb',
      encoding: contentType.parse(req).parameters.charset
    }, function (err, string) {
      if (err) return next(err)
      req.text = string
      next()
    })
  })
  


const person = require('./router/person.router')
app.use('/person',person)

const user = require('./router/user.router')
app.use('/user',user)

const chat = require('./router/chat.router')
app.use('/chat',chat)

const message = require('./router/message.router');
const ApiError = require('./utilits/ApiError');
const globalerror = require('./middleware/errormiddleware');
app.use('/message',message)




app.use(globalerror);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/",(req, res)=>{
    res.send('done')
    console.log(req.text)
})
app.all('*',(req , res , next)=>{    
    next(new ApiError(`can not found this route :${req.originalUrl}` ,400))

})

const server = mongoose.connect('mongodb://localhost:27017/mongo').then(()=>{
    app.listen(5000 , ()=>{
        console.log('connected to server and db' , 5000)
    })
})
process.on('unhandledRejection',(error)=>{
    console.error(`UnhandledRejection Errors: ${error.name} | ${error.message}`)
    server.close(()=>{
        console.error('shutting down')
        process.exit(1)

    })
})