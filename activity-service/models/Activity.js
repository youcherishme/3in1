const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ActivitySchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: Number
  },
  activityStartDate: {
    type: Date
  },
  activityStartTime: {
    type: String
  },
  activityEndDate: {
    type: Date
  },
  activityEndTime: {
    type: String
  },
  activityCategory: { 
    type: Number
  },
  description: {
    type: String
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
});

module.exports = Activity = mongoose.model('activity', ActivitySchema);
