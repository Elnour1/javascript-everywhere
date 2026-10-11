export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export interface Student {
  readonly id: number;
  name: string;
  score: number;
  email?: string;
}

export interface GradedStudent extends Student {
  grade: LetterGrade;
  passed: boolean;
  attendance: number | null;
}

export interface GradeTally {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}