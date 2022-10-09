const express = require('express')
const router = express.Router();
const personcontroller = require('../controller/personcontroller')

router.post('/' , personcontroller.insert);



module.exports = router