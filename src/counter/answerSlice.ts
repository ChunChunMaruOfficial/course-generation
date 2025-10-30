import { createSlice } from '@reduxjs/toolkit';

import type { CourseData } from "../interfaces/CourseData";

const initialState = {
  course: {} as CourseData
};

const answerSlice = createSlice({
  name: 'answer',
  initialState,
  reducers: {
    setcourse(state, action) {
      state.course = action.payload
      console.log('Redux course set:', state.course); 
    },
    completingLesson(state, action) {
      const { moduleId, lessonId } = action.payload;
      const module = state.course.modules.find(m => m.id === moduleId);
      module?.lessons[lessonId - 1] && (module.lessons[lessonId - 1].completed = true);
    },
  }

});

export const { completingLesson,setcourse } = answerSlice.actions;
export default answerSlice.reducer;
