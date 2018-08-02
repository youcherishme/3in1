const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CaseSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  description: {
    type: String
  },
  openDate: {
    type: Date,
    default: Date.now
  },
  statuteOfLimitations: {
    type: Date,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients'
  },
  clientName: {
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
  
  createdDate: {
    type: Date
  },
  
});

module.exports = Case = mongoose.model('case', CaseSchema);
