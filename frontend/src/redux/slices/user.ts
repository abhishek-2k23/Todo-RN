import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../types/user';
import { Task } from '../../types/task';

interface UserState {
  userData: UserData | null;
  tasks: Task[];
  categories: string[];
  selectedCategory: string;
  isDarkMode: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: UserState = {
  userData: null,
  tasks: [],
  categories: ['All', 'General', 'Work', 'Personal', 'Shopping', 'Other'],
  selectedCategory: 'All',
  isDarkMode: false,
  isLoading: false,
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
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setUserData,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedCategory,
  setDarkMode,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;