const { check, body } = require("express-validator");
// const validatormiddleware = require("../middleware/validatormiddleware");
const validatormiddleware = require('../middleware/validatormiddleware');


exports.getmessagevalidator = [
    check('chatId').isMongoId().withMessage("chatId is wrong"),validatormiddleware,];

exports.sendmessagevalidator = [
    check('content').notEmpty().withMessage("message is required").
    isLength({min:3}).withMessage("too short message")
    .isLength({max:200}).withMessage("toolong"),
    check('chatId').isMongoId().withMessage("chatId is wrong")
    ,validatormiddleware,];