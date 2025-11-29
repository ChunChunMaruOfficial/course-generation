import { configureStore } from '@reduxjs/toolkit';
import answerSlice from './slices/answerSlice';
import userSlice from './slices/userSlice'
export const store = configureStore({
  reducer: {
    answer: answerSlice,
    user: userSlice
  },
});
export type RootState = ReturnType<typeof store.getState>;