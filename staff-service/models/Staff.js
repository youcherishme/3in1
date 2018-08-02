const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StaffSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  code: {
    type: String
  },
  homePhoneNo: {
    type: String
  },
  workingPhoneNo: {
    type: String
  },
  workingEmail: {
    type: String
  },
  personalEmail: {
    type: String
  },
  createdDate: {
    type: Date
  },
});

module.exports = Staff = mongoose.model('staff', StaffSchema);
