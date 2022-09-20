const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateComment(data) {
  let errors = {}

  // Convert empty fields to an empty string so we can use validator functions
  data.comment = !isEmpty(data.comment) ? data.comment : ''

  // Checks
  if (Validator.isEmpty(data.comment)) {
    errors.comment = 'Comment is required!'
  }

  // Password checks
  //   if (Validator.isEmpty(data.password)) {
  //     errors.password = 'Password field is required'
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
