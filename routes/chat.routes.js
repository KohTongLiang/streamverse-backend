const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller')
const checkToken = require('../middlewares/checkToken')

router.use(checkToken)

// 1. /createThread
router.post('/createThread', chatController.createThread)

// 2. /addUserToThread
router.post('/addUserToThread', chatController.addUserToThread)

// 3. /updateGroupId
router.post('/updateGroupId', chatController.updateGroupId)

// 4. /findChat
router.get('/findChat', chatController.findChat)

module.exports = router;