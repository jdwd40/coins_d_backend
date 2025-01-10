import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { startPriceSimulator } from '../services/priceSimulator.js';

export const setupSocketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findOne({ _id: decoded.userId });

      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email);

    // Join room for each todo list the user has access to
    socket.on('join-list', (listId) => {
      socket.join(`list:${listId}`);
      console.log(`${socket.user.email} joined list: ${listId}`);
    });

    // Handle task updates
    socket.on('task-update', (data) => {
      socket.to(`list:${data.listId}`).emit('task-updated', {
        listId: data.listId,
        taskId: data.taskId,
        status: data.status,
        updatedBy: {
          id: socket.user._id,
          name: socket.user.name
        }
      });
    });

    // Handle new tasks
    socket.on('task-add', (data) => {
      socket.to(`list:${data.listId}`).emit('task-added', {
        listId: data.listId,
        task: data.task,
        addedBy: {
          id: socket.user._id,
          name: socket.user.name
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.email);
    });
  });

  // Start the price simulator
  startPriceSimulator(io);
};
