import { Request, Response } from 'express';
import Todo, { ITodo, PriorityLevel } from '../models/Todo';

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    // Only title is required
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const todoData: Partial<ITodo> = {
      title,
      description,
      completed: false,
    };

    // Add optional fields if provided
    if (dueDate) todoData.dueDate = new Date(dueDate);
    if (priority && Object.values(PriorityLevel).includes(priority)) {
      todoData.priority = priority;
    }

    const todo: ITodo = await Todo.create(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create todo' });
  }
};

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos: ITodo[] = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo: ITodo | null = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed, dueDate, priority } = req.body;
    const updateData: Partial<ITodo> = {};

    // Only include fields that are provided in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (completed === true) updateData.completedAt = new Date();
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (priority !== undefined && Object.values(PriorityLevel).includes(priority)) {
      updateData.priority = priority;
    }

    const todo: ITodo | null = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo: ITodo | null = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
