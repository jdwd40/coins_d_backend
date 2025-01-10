import express from 'express';
import auth from '../middleware/auth.js';
import TodoList from '../models/TodoList.js';

const router = express.Router();

// Get all todo lists for a user
router.get('/', auth, async (req, res) => {
  try {
    const todoLists = await TodoList.find({
      users: req.user._id
    }).populate('owner', 'name email');
    
    res.json(todoLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo lists', error: error.message });
  }
});

// Create a new todo list
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const todoList = new TodoList({
      name,
      owner: req.user._id,
      users: [req.user._id]
    });
    
    await todoList.save();
    res.status(201).json(todoList);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo list', error: error.message });
  }
});

// Add task to todo list
router.post('/:listId/tasks', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const todoList = await TodoList.findOne({
      _id: req.params.listId,
      users: req.user._id
    });

    if (!todoList) {
      return res.status(404).json({ message: 'Todo list not found' });
    }

    todoList.tasks.push({
      text,
      createdBy: req.user._id
    });

    await todoList.save();
    res.status(201).json(todoList);
  } catch (error) {
    res.status(500).json({ message: 'Error adding task', error: error.message });
  }
});

// Update task status
router.patch('/:listId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const todoList = await TodoList.findOneAndUpdate(
      {
        _id: req.params.listId,
        users: req.user._id,
        'tasks._id': req.params.taskId
      },
      {
        $set: {
          'tasks.$.status': status
        }
      },
      { new: true }
    );

    if (!todoList) {
      return res.status(404).json({ message: 'Todo list or task not found' });
    }

    res.json(todoList);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Share todo list with another user
router.post('/:listId/share', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todoList = await TodoList.findOne({
      _id: req.params.listId,
      owner: req.user._id
    });

    if (!todoList) {
      return res.status(404).json({ message: 'Todo list not found' });
    }

    if (todoList.users.includes(user._id)) {
      return res.status(400).json({ message: 'User already has access to this list' });
    }

    todoList.users.push(user._id);
    await todoList.save();
    
    res.json(todoList);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing todo list', error: error.message });
  }
});

export default router;
