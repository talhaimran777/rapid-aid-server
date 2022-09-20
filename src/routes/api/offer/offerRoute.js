const express = require('express')
const { getOffers, postOffer } = require('../../../controllers/offer/offerController')
const auth = require('../../../middlewares/auth')
const checkObjectId = require('../../../middlewares/checkObjectId')
const { body, check } = require('express-validator')
const router = express.Router()

router
  .route('/:id')
  .post(
    [
      auth,
      checkObjectId('id'),
      body('description').isLength({ min: 30 }).withMessage('Description must be atleast 30 characters long!'),
      body('offeredAmount').isNumeric().withMessage('Offered amount must be a number'),
    ],
    postOffer
  )
router.route('/').get([auth], getOffers)

module.exports = router
