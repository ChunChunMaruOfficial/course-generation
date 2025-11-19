import { createSlice } from '@reduxjs/toolkit';

import type { CourseData } from "../interfaces/CourseData";

const initialState = {
  course: [] as CourseData[],
  activecourse: 0 as number,
  activemodule: 0 as number,
  activelesson: 0 as number
};

const answerSlice = createSlice({
  name: 'answer',
  initialState,
  reducers: {
    addcourse(state, action) {
      state.course = [...state.course, action.payload]
      console.log('Redux course add:', state.course);
    },
    setactivecourse(state, action) {
      state.activecourse = action.payload
    },
    setactivemodule(state, action) {
      state.activemodule = action.payload
    },
    setactivelesson(state, action) {
      state.activelesson = action.payload
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

export const { completingLesson, addcourse, setcourse,setactivecourse, setactivemodule, setactivelesson  } = answerSlice.actions;
export default answerSlice.reducer;
