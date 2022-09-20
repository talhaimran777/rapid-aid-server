const express = require('express')
const { body, check } = require('express-validator')
const { postMessage, getMessages } = require('../../../controllers/message/messageController')
// const { getTasks, getTask, postTask, addComment } = require('../../../controllers/task/taskController')
const auth = require('../../../middlewares/auth')
const checkObjectId = require('../../../middlewares/checkObjectId')

const router = express.Router()

router.route('/').post(auth, postMessage)
router.route('/:id').get([auth, checkObjectId('id')], getMessages)

module.exports = router
