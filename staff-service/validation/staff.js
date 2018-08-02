const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateStaffInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First Name field is required';
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
