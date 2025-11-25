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

    setactivelessoncontent(state, action) {
      state.course[state.activecourse].modules[state.activemodule].lessons[state.activelesson].content = action.payload
    },
    setactivelessonlinks(state, action) {
      state.course[state.activecourse].modules[state.activemodule].lessons[state.activelesson].links = action.payload
    },

    setcourse(state, action) {
      state.course = action.payload
      console.log('Redux course add:', state.course);
    },

    selectasimp(state, action) {
      console.log(action.payload);
      state.course[state.activecourse].modules[state.activemodule].lessons[state.activelesson].content =
        state.course[state.activecourse].modules[state.activemodule].lessons[state.activelesson].content
          .replace(action.payload, `<span>${action.payload}</span>`);

      console.log(state.course[state.activecourse].modules[state.activemodule].lessons[state.activelesson].content);

    },

    completingLesson(state, action) {
      const { courseId, moduleId, lessonId } = action.payload;
      const module = state.course[courseId].modules.find(m => m.id === moduleId);
      module?.lessons[lessonId - 1] && (module.lessons[lessonId - 1].completed = true);
    },
  }

});

export const { completingLesson, addcourse, setcourse, setactivecourse, setactivemodule, setactivelesson, selectasimp, setactivelessoncontent, setactivelessonlinks } = answerSlice.actions;
export default answerSlice.reducer;
