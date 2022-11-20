const express = require('express')
const router = express.Router();
const messagecontroller = require('../controller/messagecontroller')
const requireAuth = require('../middleware/requireauth')
const { body, validationResult, param } = require('express-validator');
const validatormiddleware = require('../middleware/validatormiddleware');
const {getmessagevalidator,sendmessagevalidator} = require('../validation/messagevalidator')

// make middleware of all routes
// router.use(requireAuth)


router.post('/' ,sendmessagevalidator, messagecontroller.sendMessage);
// router.get('/:chatId' ,param('chatId').isMongoId().withMessage("chatId is wrong"),validatormiddleware, messagecontroller.allmessage);
router.get('/:chatId' ,getmessagevalidator, messagecontroller.allmessage);




module.exports = router