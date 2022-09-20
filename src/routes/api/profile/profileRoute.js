const express = require('express')
const { body, check } = require('express-validator')
const { getMyProfile, updateProfile, getProfile } = require('../../../controllers/profile/profileController')

const auth = require('../../../middlewares/auth')
const checkObjectId = require('../../../middlewares/checkObjectId')

// const { login, register } = require('../../../controllers/auth/authController')
const router = express.Router()

router.route('/me').get(auth, getMyProfile)
router.route('/:id').get([auth, checkObjectId('id')], getProfile)
router
  .route('/me')
  .patch(
    [
      auth,
      check('designation', 'Designation is required').notEmpty(),
      check('country', 'Country is required').notEmpty(),
      check('city', 'City is required').notEmpty(),
      check('phone', 'Phone is required').notEmpty(),
      check('address', 'Address is required').notEmpty(),
    ],
    updateProfile
  )
// router.route('/register').post(register);
// router.route('/login').post(login)
// router.route('/register').post(register)

// router.route('/:id/reviews').post(protect, createProductReview);
// router.get('/top', getTopProducts);
// router
//   .route('/:id')
//   .get(getProductById)
//   .delete(protect, admin, deleteProduct)
//   .put(protect, admin, updateProduct);

module.exports = router
