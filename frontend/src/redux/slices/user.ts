import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for user data, tasks, and categories
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
  completionTime?: string;
  createdAt: string;
  updatedAt: string;
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
  selectedCategory: string;
  isDarkMode: boolean;
}

// Initial state
const initialState: UserState = {
  userData: null,
  tasks: [],
  categories: [{id: '1', name: 'Work'}, {id: '2', name: 'Personal'}],
  selectedCategory: 'All',
  isDarkMode: false,
};

// Create a slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

// Export actions and reducer
export const { setUserData, setTasks, addTask, updateTask, deleteTask, addCategory, removeCategory, setSelectedCategory, setDarkMode } = userSlice.actions;
export default userSlice.reducer;