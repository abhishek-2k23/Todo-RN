import { Router } from 'express';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

const router = Router();

// Todo routes
router.post('/createTask', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/updateTask/:id', updateTodo);
router.delete('/deleteTask/:id', deleteTodo);

export default router; 