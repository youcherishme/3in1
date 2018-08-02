const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DocumentSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  documentDate: {
    type: Date,
    default: Date.now
  },

  uploadFiles: [
    {
      _id: String,
      uploadFileUrl: {
        type: String
      },
      uploadFileName: {
        type: String
      },
      uploadDate: {
        type: Date,
        default: Date.now
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      userName: {
        type: String
      },
    },
  ],

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
  attacherType: {
    type: Number
  },

  createdDate: {
    type: Date
  },
  
});

module.exports = Document = mongoose.model('Document', DocumentSchema);
