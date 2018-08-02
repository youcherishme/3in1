const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DeliveryOrderSchema = new Schema({
  deliveryOrderNo: {
    type: String
  },
  deliveryOrderDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  termsConditions: {
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

  deliveryOrderItems: [
    {
      _id: String,
      content: {
        type: String
      },
      description: {
        type: String
      },
      price: {
        type: Number
      },
      quantity: {
        type: Number
      },
      total: {
        type: Number
      },
    }
  ],
  
});

module.exports = DeliveryOrder = mongoose.model('deliveryOrder', DeliveryOrderSchema);
