import { createSlice } from '@reduxjs/toolkit';

import type { CourseData } from "../interfaces/CourseData";

const initialState = {
  courses: [] as CourseData[],
  activecourse: {} as CourseData,
  activemodule: 0 as number,
  activelesson: 0 as number
};

const answerSlice = createSlice({
  name: 'answer',
  initialState,
  reducers: {
    addcourse(state, action) {
      state.courses = [...state.courses, action.payload]
      console.log('Redux course add:', state.courses);
    },
    setactivecourse(state, action) {
      state.activecourse = state.courses.find((v: CourseData) => v.id == action.payload)!
      
    },
    setactivemodule(state, action) {
      state.activemodule = action.payload
    },
    setactivelesson(state, action) {
      state.activelesson = action.payload
    },

    setactivelessoncontent(state, action) {
      state.activecourse.modules[state.activemodule].lessons[state.activelesson].content = action.payload
    },
    setactivelessonlinks(state, action) {
      state.activecourse.modules[state.activemodule].lessons[state.activelesson].links = action.payload
    },

    setcourse(state, action) {
      state.courses = action.payload
      console.log('Redux course add:', state.courses);
    },

    selectasimp(state, action) {
      console.log(action.payload);
      state.activecourse.modules[state.activemodule].lessons[state.activelesson].content =
        state.activecourse.modules[state.activemodule].lessons[state.activelesson].content
          .replace(action.payload, `<span>${action.payload}</span>`);

      console.log(state.activecourse.modules[state.activemodule].lessons[state.activelesson].content);

    },

  }

});

export const { addcourse, setcourse, setactivecourse, setactivemodule, setactivelesson, selectasimp, setactivelessoncontent, setactivelessonlinks } = answerSlice.actions;
export default answerSlice.reducer;
