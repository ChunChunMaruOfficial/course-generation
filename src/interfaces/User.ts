import type { CourseData } from "./CourseData";

export interface User {
    id: number;
    mail: string;
    date: string;
    tokens: number;
    courses: CourseData[]
}