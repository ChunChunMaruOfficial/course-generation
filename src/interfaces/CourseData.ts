import type { Module } from "./Module";

export interface CourseData {
  title: string;
  modulesCount: number;
  lessonsCount: number;
  progress: number;
  modules: Module[];
}