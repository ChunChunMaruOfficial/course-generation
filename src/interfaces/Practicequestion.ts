import type { Practiceoption } from "./Practiceoption";

export interface Practicequestion {
    id: number,
    question: string,
    options: Practiceoption[]
}