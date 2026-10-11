// ==========================================
// 5.2 — typed-db.ts — The Functions
// ==========================================

import type {
  StudentRecord,
  CourseRecord,
  EnrollmentRecord,
  GradeRecord,
  StudentGradeReport,
  BaseEntity,
} from "./db-types.ts";

// Tables as Record<number, ...> constants
const studentsTable: Record<number, StudentRecord> = {
  1: { id: 1, name: "Sara Ahmed", email: "sara@example.com", track: "Frontend" },
  2: { id: 2, name: "Omar Hassan", email: "omar@example.com", phone: "+201001234567", track: "Fullstack" },
};

const coursesTable: Record<number, CourseRecord> = {
  101: { id: 101, title: "TypeScript In Depth", creditHours: 3 },
  102: { id: 102, title: "Next.js Applications", creditHours: 4, description: "Advanced modern full-stack web" },
};

const enrollmentsTable: Record<number, EnrollmentRecord> = {
  501: { id: 501, studentId: 1, courseId: 101, enrolledAt: "2026-09-01" },
  502: { id: 502, studentId: 2, courseId: 102, enrolledAt: "2026-09-05" },
};

const gradesTable: Record<number, GradeRecord> = {
  901: { id: 901, enrollmentId: 501, score: 95, status: "graded" },
  902: { id: 902, enrollmentId: 502, score: 88, status: "graded" },
};

// Generic lookup helper returning Promise<T>
async function lookup<T extends BaseEntity>(table: Record<number, T>, id: number): Promise<T> {
  const record = table[id];
  if (!record) {
    throw new Error(`Record with id ${id} not found.`);
  }
  return record;
}

// Typed getter functions returning Promise<...>
export async function getStudent(id: number): Promise<StudentRecord> {
  return lookup(studentsTable, id);
}

export async function getCourse(id: number): Promise<CourseRecord> {
  return lookup(coursesTable, id);
}

export async function getEnrollment(id: number): Promise<EnrollmentRecord> {
  return lookup(enrollmentsTable, id);
}

export async function getGradeByEnrollment(enrollmentId: number): Promise<GradeRecord> {
  const grade = Object.values(gradesTable).find((g) => g.enrollmentId === enrollmentId);
  if (!grade) {
    throw new Error(`Grade for enrollment ${enrollmentId} not found.`);
  }
  return grade;
}

// Safe error helper handling 'unknown'
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// buildReport(id) returning a typed StudentGradeReport
export async function buildReport(studentId: number): Promise<StudentGradeReport> {
  const student = await getStudent(studentId);
  const enrollment = Object.values(enrollmentsTable).find((e) => e.studentId === student.id);
  if (!enrollment) {
    throw new Error(`No active enrollment found for student ${student.name}`);
  }

  const course = await getCourse(enrollment.courseId);
  const grade = await getGradeByEnrollment(enrollment.id);

  return {
    studentId: student.id,
    name: student.name,
    track: student.track,
    courseTitle: course.title,
    score: grade.score,
    status: grade.status,
  };
}

// Main with try / catch printing report and handled error
async function main(): Promise<void> {
  console.log("--- 5.2 Typed DB Demo ---");

  // 1. Success case
  try {
    const report = await buildReport(1);
    console.log("Built Report Successfully:");
    console.log(
      `Student: ${report.name} | Track: ${report.track} | Course: ${report.courseTitle} | Score: ${report.score} (${report.status})`
    );
  } catch (err) {
    console.error("Unexpected error:", errorMessage(err));
  }

  // 2. Expected failure case (missing student ID)
  try {
    console.log("\nQuerying non-existent student (ID: 99)...");
    await buildReport(99);
  } catch (err) {
    console.log("Handled Expected Error:", errorMessage(err));
  }
}

void main();

// ==========================================
// 5.3 — Break It (Recorded Errors in Comments)
// ==========================================

// 1. Misspelled property in a row:
// const brokenStudent: StudentRecord = { id: 3, name: "Ali", email: "a@b.com", trak: "Frontend" };
// Error TS2353: Object literal may only specify known properties, and 'trak' does not exist in type 'StudentRecord'. Did you mean to write 'track'?

// 2. Left out a required property:
// const missingEmail: StudentRecord = { id: 4, name: "Kareem", track: "Backend" };
// Error TS2741: Property 'email' is missing in type '{ id: number; name: string; track: "Backend"; }' but required in type 'StudentRecord'.

// 3. Reassigned a readonly id:
// const s = studentsTable[1]!;
// s.id = 99;
// Error TS2540: Cannot assign to 'id' because it is a read-only property.

// 4. Changed 'import type' to plain 'import' and ran with Node:
// If verbatimModuleSyntax or erasableSyntaxOnly is enabled, importing a pure type/interface without the 'type' keyword causes:
// SyntaxError: The requested module './db-types.ts' does not provide an export named 'StudentRecord' (because interfaces are completely erased from JS emitted code!).

// 5. Real mistakes the types found in Day 04/05 data:
// In Day 04/05, accessing array/lookup properties often assumed an object was always returned.
// TypeScript caught that table lookups return undefined when an ID does not exist, and caught typos in status strings like "passed" instead of "graded".