const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const InvoiceSchema = new Schema({
  invoiceNo: {
    type: String
  },
  invoiceDate: {
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
  balanceDue: {
    type: Number
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

  invoiceExpenses: [
    {
      _id: String,
      content: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      userName: {
        type: String
      },
      expenseDate: {
        type: Date,
        default: Date.now
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
      billable: {
        type: Boolean
      },

    }
  ],
  invoiceAdjustments: [
    {
      _id: String,
      content: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      userName: {
        type: String
      },
      adjustmentDate: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String
      },
      amount: {
        type: Number
      },
    }
  ],  
  invoicePayments: [
    {
      _id: String,
      content: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      userName: {
        type: String
      },
      paymentMethod: {    //1=Cash, 2=Bank Transfer, 3=Credit Card, 4=Paypal, 5=Check
        type: Number,
      },
      paymentMethodNote: {    
        type: String
      },
      paymentDate: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String
      },
      amount: {
        type: Number
      },
    }
  ],
  
});

module.exports = Invoice = mongoose.model('invoice', InvoiceSchema);
