import express from 'express';
import * as todoController from '../controllers/todo.controller';
import * as categoryController from '../controllers/category.controller';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Todo routes
router.post('/todos', auth, todoController.createTodo);
router.get('/todos', auth, todoController.getTodos);
router.put('/todos/:id', auth, todoController.updateTodo);
router.delete('/todos/:id', auth, todoController.deleteTodo);

// Category routes
router.post('/categories', auth, categoryController.createCategory);
router.get('/categories', auth, categoryController.getCategories);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);

export default router; 