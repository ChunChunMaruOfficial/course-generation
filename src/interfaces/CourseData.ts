import type { Module } from "./Module";

export interface CourseData {
  id: number;
  title: string;
  lessonsCount: number;
  progress: number;
  modules: Module[];
}