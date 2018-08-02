const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TaskSchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: Number
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: Number
  },
  description: {
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

  taskTodos: [
    {
      _id: String,
      status: {
        type: Number
      },
      content: {
        type: String
      },
    }
  ],
});

module.exports = Task = mongoose.model('task', TaskSchema);
