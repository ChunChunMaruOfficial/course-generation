import { configureStore } from '@reduxjs/toolkit';
import answerSlice from './counter/answerSlice';

export const store = configureStore({
  reducer: {
    answer: answerSlice,
  },
});
