// frontend/src/redux/slices/user.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for user data, tasks, and categories
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  userData: UserData | null;
  tasks: Task[];
  categories: Category[];
}

// Initial state
const initialState: UserState = {
  userData: null,
  tasks: [],
  categories: [{id: '1', name: 'Work'}, {id: '2', name: 'Personal'}],
};

// Create a slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { setUserData, addTask, updateTask, deleteTask, addCategory, removeCategory } = userSlice.actions;
export default userSlice.reducer;