import type { Lesson } from "./Lesson";

export interface Module {
  id: number;
  title: string;
  completed: boolean;
  lessons: Lesson[];
}