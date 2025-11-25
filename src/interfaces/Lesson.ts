import type { Link } from "./Link";

export interface Lesson {
  id: number;
  title: string;
  completed: boolean;
  content: string;
  theorycompl: number;
  practicecompl: number;
  links: Link[]
}