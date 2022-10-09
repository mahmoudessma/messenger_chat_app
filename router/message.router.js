const express = require('express')
const router = express.Router();
const messagecontroller = require('../controller/messagecontroller')
const requireAuth = require('../middleware/requireauth')

// make middleware of all routes
router.use(requireAuth)


router.post('/' , messagecontroller.sendMessage);
router.get('/:chatId' , messagecontroller.allmessage);



module.exports = router