const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDeliveryOrderInput(data) {
  let errors = {};

  data.deliveryOrderNo = !isEmpty(data.deliveryOrderNo) ? data.deliveryOrderNo : '';

  if (Validator.isEmpty(data.deliveryOrderNo)) {
    errors.deliveryOrderNo = 'Invoice No field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
