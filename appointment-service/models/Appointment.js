const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AppointmentSchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: Number
  },
  appointmentDate: {
    type: Date
  },
  appointmentTime: {
    type: String
  },
  appointmentCategory: { 
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

  attacherid: {
    type: String
  },
  attacherTag: {
    type: String
  },
  attacherType: {
    type: Number
  },
  createdDate: {
    type: Date
  },

});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema);
