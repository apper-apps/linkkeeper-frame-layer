import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import bundlingReducer from './bundlingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    bundling: bundlingReducer,
  },
});