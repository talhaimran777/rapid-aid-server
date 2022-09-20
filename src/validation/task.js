// const { check, body } = require('express-validator')
// const Validator = require('validator')
// const isEmpty = require('is-empty')

// module.exports = function validateTask(data) {
//   let errors = {}

//   // Convert empty fields to an empty string so we can use validator functions
//   data.title = !isEmpty(data.title) ? data.title : ''
//   data.description = !isEmpty(data.description) ? data.description : ''
//   data.address = !isEmpty(data.address) ? data.address : ''

//   // Checks
//   if (Validator.isEmpty(data.title)) {
//     errors.title = 'Title field is required'
//   } else if (Validator.isEmpty(data.description)) {
//     errors.description = 'Description field is required'
//   } else if (Validator.isEmpty(data.address)) {
//     errors.address = 'Address field is required'
//   }

//   return {
//     errors,
//     isValid: isEmpty(errors),
//   }
// }

// module.exports = validateTask = (req, res, next) => {
//   check('title', 'Title field is requierd!').notEmpty()
//   body('title').isLength({ min: 10, max: 50 }).withMessage('Title must be between 10 and 50 characters')
//   next()
// }
