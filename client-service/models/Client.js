const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  //1=individual, 2=business
  clientType: { 
    type: Number
  },
  code: {
    type: String
  },
  description: {
    type: String
  },

  phoneNo: {
    type: String
  },
  createdDate: {
    type: Date
  },
  homeAndStreet: {
    type: String
  },
  unit: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },

  //2=business
  name: {
    type: String
  },
  ein: {
    type: String
  },

  //1=individual
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },

  ssn: {
    type: String
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userName: {
    type: String
  },
  userEmail: {
    type: String
  },
  
});

module.exports = Client = mongoose.model('client', ClientSchema);
