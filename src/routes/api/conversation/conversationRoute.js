const express = require('express')
const { body, check } = require('express-validator')
const { getConversations } = require('../../../controllers/conversation/conversationController')

const auth = require('../../../middlewares/auth')
const checkObjectId = require('../../../middlewares/checkObjectId')

const router = express.Router()

router.route('/').get(auth, getConversations)

module.exports = router
