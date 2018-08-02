const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ContactSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients'
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNo: {
    type: String
  },
  email: {
    type: String
  },
  relationship: { //relationship with Client: 0: none, 1: self, 2: spouse, 3: child, 4: parent, 5: sibling
    type: Number
  },  
  createdDate: {
    type: Date
  },
  
});

module.exports = Contact = mongoose.model('contact', ContactSchema);
