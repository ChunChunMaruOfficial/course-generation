import { createSlice } from '@reduxjs/toolkit';

import type { CourseData } from "../interfaces/CourseData";

const initialState = {
  course: [] as CourseData[]
};

const answerSlice = createSlice({
  name: 'answer',
  initialState,
  reducers: {
    addcourse(state, action) {
      state.course = [...state.course, action.payload]
      console.log('Redux course add:', state.course); 
    },
    setcourse(state, action) {
      state.course = action.payload
      console.log('Redux course add:', state.course); 
    },
    completingLesson(state, action) {
      const { courseId, moduleId, lessonId } = action.payload;
      const module = state.course[courseId].modules.find(m => m.id === moduleId);
      module?.lessons[lessonId - 1] && (module.lessons[lessonId - 1].completed = true);
    },
  }

});

export const { completingLesson, addcourse,setcourse } = answerSlice.actions;
export default answerSlice.reducer;
