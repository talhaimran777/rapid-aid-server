const express = require('express')
const { createOrder, getOrder, markOrderComplete } = require('../../../controllers/order/orderController')
const auth = require('../../../middlewares/auth')
const checkObjectId = require('../../../middlewares/checkObjectId')
const { body, check } = require('express-validator')
const router = express.Router()

router.route('/').post([auth], createOrder).get([auth], getOrder)

router.route('/:id').put([auth], markOrderComplete)

module.exports = router
