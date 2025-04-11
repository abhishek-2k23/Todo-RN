import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import themeReducer from './slices/theme';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;