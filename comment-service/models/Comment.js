const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
  content: {
    type: String
  },
  commentDate: {
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

module.exports = Comment = mongoose.model('Comment', CommentSchema);
