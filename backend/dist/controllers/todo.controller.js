"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodos = exports.createTodo = void 0;
const todo_model_1 = require("../models/todo.model");
const createTodo = async (req, res) => {
    var _a;
    try {
        const { title, description, dueDate, priority, category } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todo = new todo_model_1.Todo({
            title,
            description,
            dueDate,
            priority,
            category: category || 'Other',
            user: userId
        });
        await todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
};
exports.createTodo = createTodo;
const getTodos = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todos = await todo_model_1.Todo.find({ user: userId })
            .sort({ createdAt: -1 });
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
};
exports.getTodos = getTodos;
const updateTodo = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, completed, dueDate, priority, category } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todo = await todo_model_1.Todo.findOne({ _id: id, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        // If completed status is changing to true, set completedAt
        if (completed !== undefined && completed !== todo.completed) {
            todo.completed = completed;
            todo.completedAt = completed ? new Date() : undefined;
        }
        // Update other fields
        if (title)
            todo.title = title;
        if (description !== undefined)
            todo.description = description;
        if (dueDate)
            todo.dueDate = dueDate;
        if (priority)
            todo.priority = priority;
        if (category)
            todo.category = category;
        await todo.save();
        res.json(todo);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating todo', error });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todo = await todo_model_1.Todo.findOneAndDelete({ _id: id, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error });
    }
};
exports.deleteTodo = deleteTodo;
