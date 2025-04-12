import { Request, Response } from 'express';
import { Todo } from '../models/todo.model';

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;
    const userId = req.user?.id;

    const todo = new Todo({
      title,
      description,
      dueDate,
      priority,
      category: category || 'Other',
      user: userId
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todos = await Todo.find({ user: userId })
      .sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate, priority, category } = req.body;
    const userId = req.user?.id;

    const todo = await Todo.findOne({ _id: id, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // If completed status is changing to true, set completedAt
    if (completed !== undefined && completed !== todo.completed) {
      todo.completed = completed;
      todo.completedAt = completed ? new Date() : undefined;
    }

    // Update other fields
    if (title) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (dueDate) todo.dueDate = dueDate;
    if (priority) todo.priority = priority;
    if (category) todo.category = category;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
}; 