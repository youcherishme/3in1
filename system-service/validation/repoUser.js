const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateStaffInput(data) {
  let errors = {};

  data.userEmail = !isEmpty(data.userEmail) ? data.userEmail : '';

  if (Validator.isEmpty(data.userEmail)) {
    errors.userEmail = 'Email field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
