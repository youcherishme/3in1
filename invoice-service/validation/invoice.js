const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateInvoiceInput(data) {
  let errors = {};

  data.invoiceNo = !isEmpty(data.invoiceNo) ? data.invoiceNo : '';
  data.invoiceDate = !isEmpty(data.invoiceDate) ? data.invoiceDate : '';

  if (Validator.isEmpty(data.invoiceNo)) {
    errors.invoiceNo = 'Invoice No field is required';
  }

  if (Validator.isEmpty(data.invoiceDate)) {
    errors.invoiceDate = 'Invoice Date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
