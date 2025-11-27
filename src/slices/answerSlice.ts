import { createSlice } from '@reduxjs/toolkit';

import type { CourseData } from "../interfaces/CourseData";

const initialState = {
  courses: [] as CourseData[],
  activecourse: {} as CourseData,
  activemoduleid: 1 as number,
  activelessonid: 1 as number
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
      state.activemoduleid = action.payload
    },
    addselectedword(state, action) {
      state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.selectedwords.push(action.payload)
    },
    setlessonstatus(state, action) {
      state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.status = action.payload
    },
    setactivelesson(state, action) {
      state.activelessonid = action.payload
    },

    setactivelessoncontent(state, action) {
      state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.content = action.payload
    },
    setactivelessonlinks(state, action) {
      state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.links = action.payload
    },

    setcourses(state, action) {
      state.courses = action.payload
      console.log('Redux course add:', state.courses);
    },

    selectasimp(state, action) {
      state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.content =
        state.activecourse.modules.find(v => v.id == state.activemoduleid)!.lessons.find(v => v.id == state.activelessonid)!.content
          .replace(action.payload, `<span>${action.payload}</span>`);
    },

  }

});

export const { addcourse, setlessonstatus, setcourses, setactivecourse, setactivemodule, setactivelesson, selectasimp, setactivelessoncontent, setactivelessonlinks,addselectedword } = answerSlice.actions;
export default answerSlice.reducer;
