// ==========================================
// 6.2 — guards.ts — Untrusted Data
// ==========================================

export interface Student {
  id: number;
  name: string;
  score: number;
}

// 1. User-defined Type Guard for Student with range validation (0 - 100):
export function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  const hasValidId = typeof candidate.id === "number" && Number.isInteger(candidate.id);
  const hasValidName = typeof candidate.name === "string" && candidate.name.trim().length > 0;
  const hasValidScore =
    typeof candidate.score === "number" &&
    !Number.isNaN(candidate.score) &&
    candidate.score >= 0 &&
    candidate.score <= 100;

  return hasValidId && hasValidName && hasValidScore;
}

// 2. JSON string of 6 records (3 valid, 3 broken in different ways):
const rawStudentsJson = JSON.stringify([
  { id: 1, name: "Sara", score: 95 }, // Valid
  { id: 2, name: "", score: 85 }, // Invalid: empty name
  { id: 3, name: "Omar", score: 110 }, // Invalid: score out of range (> 100)
  { id: 4, name: "Ali", score: 78 }, // Valid
  { id: "5", name: "Mona", score: 90 }, // Invalid: id is string, not number
  { id: 6, name: "Nour", score: 99 }, // Valid
]);

// 3. Parse as unknown, check Array.isArray, and filter into Student[]:
const parsedData: unknown = JSON.parse(rawStudentsJson);

if (Array.isArray(parsedData)) {
  const validStudents: Student[] = parsedData.filter(isStudent);
  const rejectedCount = parsedData.length - validStudents.length;

  console.log("Valid student names:", validStudents.map((s) => s.name));
  console.log("Total rejected records:", rejectedCount);
}

// Comment on changing return type to boolean:
// If 'isStudent' returns boolean instead of 'value is Student':
// parsedData.filter(isStudent) infers type as unknown[] instead of Student[].
// TypeScript won't narrow the array elements, forcing unsafe casts later.

// 4. Guard for a second shape from Task 5 (CourseRecord):
export interface Course {
  id: number;
  title: string;
  creditHours: number;
}

export function isCourse(value: unknown): value is Course {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.creditHours === "number" &&
    candidate.creditHours > 0
  );
}

const testCourse: unknown = { id: 101, title: "TypeScript Mastery", creditHours: 3 };
if (isCourse(testCourse)) {
  console.log(`Valid course verified: ${testCourse.title} (${testCourse.creditHours} credits)`);
}

// ==========================================
// 5. Explanation: raw as Student vs isStudent(raw)
// ==========================================
// 'raw as Student' (Type Assertion):
// - Blindly tells the TypeScript compiler "trust me, this matches Student".
// - Zero runtime checking is performed. If raw is malformed or missing fields,
//   the code compiles without errors but crashes at runtime when properties are accessed.
//
// 'isStudent(raw)' (User-defined Type Guard):
// - Performs actual JavaScript checks at runtime (typeof, range checks, null checks).
// - Guarantees that the data actually conforms to the shape before TypeScript allows access,
//   making it completely safe for untrusted outside data (APIs, JSON, user input).