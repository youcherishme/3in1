const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateClientInput(data) {
  let errors = {};
  //1=individual, 2=business
  if(data.clientType == 1)
  {
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    if (Validator.isEmpty(data.firstName)) {
      errors.firstName = 'First Name field is required';
    }  
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    if (Validator.isEmpty(data.lastName)) {
      errors.lastName = 'Last Name field is required';
    }  
  }
  else   if(data.clientType == 2)
  {
    data.name = !isEmpty(data.name) ? data.name : '';
    if (Validator.isEmpty(data.name)) {
      errors.name = 'Name field is required';
    }  
  }
  data.code = !isEmpty(data.code) ? data.code : '';

  if (Validator.isEmpty(data.code)) {
    errors.code = 'Code field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
