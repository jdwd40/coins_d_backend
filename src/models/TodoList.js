import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const todoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tasks: [taskSchema],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const TodoList = mongoose.model('TodoList', todoListSchema);

export default TodoList;
