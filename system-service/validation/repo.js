const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateStaffInput(data) {
  let errors = {};

  data.repoCode = !isEmpty(data.repoCode) ? data.repoCode : '';

  if (Validator.isEmpty(data.repoCode)) {
    errors.repoCode = 'Code field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
