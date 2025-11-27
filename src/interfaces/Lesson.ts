import type { Link } from "./Link";
import type { Practicequestion } from "./Practicequestion";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  theorycompl: number;
  practicecompl: number;
  links: Link[];
  practice: Practicequestion[]
}