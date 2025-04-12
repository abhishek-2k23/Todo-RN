import express from 'express';
import { auth } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';
import * as todoController from '../controllers/todo.controller';

const router = express.Router();

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);

// Todo routes
router.post('/todos', auth, todoController.createTodo);
router.get('/todos', auth, todoController.getTodos);
router.put('/todos/:id', auth, todoController.updateTodo);
router.delete('/todos/:id', auth, todoController.deleteTodo);

export default router; 