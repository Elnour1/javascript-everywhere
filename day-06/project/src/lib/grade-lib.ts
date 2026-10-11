import type { Student, LetterGrade } from "../types.ts";

export function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "number" &&
    Number.isInteger(c.id) &&
    typeof c.name === "string" &&
    c.name.trim().length > 0 &&
    typeof c.score === "number" &&
    !Number.isNaN(c.score) &&
    c.score >= 0 &&
    c.score <= 100 &&
    (c.email === undefined || typeof c.email === "string")
  );
}

export function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s, 0);
  return Number((total / scores.length).toFixed(1));
}