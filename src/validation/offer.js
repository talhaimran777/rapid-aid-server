const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateOffer(data) {
  let errors = {}

  // Convert empty fields to an empty string so we can use validator functions
  data.description = !isEmpty(data.description) ? data.description : ''
  data.offeredAmount = !isEmpty(data.offeredAmount) ? data.offeredAmount : ''

  // Checks
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description is required!'
  }

  if (Validator.isEmpty(data.offeredAmount)) {
    errors.offeredAmount = 'OfferedAmount is required!'
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
