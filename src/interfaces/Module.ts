import type { Lesson } from "./Lesson";

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}