const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateQuotationInput(data) {
  let errors = {};

  data.quotationNo = !isEmpty(data.quotationNo) ? data.quotationNo : '';

  if (Validator.isEmpty(data.quotationNo)) {
    errors.quotationNo = 'Invoice No field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
