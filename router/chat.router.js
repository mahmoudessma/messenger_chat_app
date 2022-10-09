const express = require('express')
const router = express.Router();
const chatcontroller = require('../controller/chatcontroller')
const requireAuth = require('../middleware/requireauth')

// make middleware of all routes
router.use(requireAuth)


router.post('/' , chatcontroller.accessChat);
router.get('/' , chatcontroller.fetchchat);
router.post('/groupChat' , chatcontroller.groupChat);
router.put('/rename' , chatcontroller.rename);
router.put('/remove' , chatcontroller.remove);
router.put('/add' , chatcontroller.add);



module.exports = router