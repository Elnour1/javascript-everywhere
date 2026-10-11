// ==========================================
// 9.1 — Utility Types Lab
// ==========================================

// Base interface from Task 5
export interface CourseRecord {
  readonly id: number;
  title: string;
  creditHours: number;
  description?: string;
  // If we add a new required property here, e.g.:
  // category: string;
  // -> Recorded: Lines in initializers and factories turn red immediately.
  // -> Why that's good: It provides instant compile-time feedback, ensuring any
  //    contract changes are updated everywhere across the application without silent bugs.
}

// 1. New… = Omit<…, "id"> and an add…(input) function assigning the id:
export type NewCourse = Omit<CourseRecord, "id">;

let nextCourseId = 200;
export function addCourse(input: NewCourse): CourseRecord {
  const newRecord: CourseRecord = {
    id: ++nextCourseId,
    ...input,
  };
  return newRecord;
}

const createdCourse = addCourse({
  title: "React Fundamentals",
  creditHours: 3,
  description: "Introduction to React components and state",
});
console.log("Added Course:", createdCourse);

// 2. …Update = Partial<Omit<…, "id">> and update… using spread (no mutation):
export type CourseUpdate = Partial<Omit<CourseRecord, "id">>;

export function updateCourse(course: CourseRecord, changes: CourseUpdate): CourseRecord {
  return {
    ...course,
    ...changes,
  };
}

const updatedCourse = updateCourse(createdCourse, {
  title: "React & Next.js Fundamentals",
});
console.log("Updated Course (immutable):", updatedCourse);

// 3. Proved update… rejects an 'id' and a wrong value type:
// updateCourse(createdCourse, { id: 999 });
// Error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'CourseUpdate'.

// updateCourse(createdCourse, { creditHours: "four" });
// Error TS2322: Type 'string' is not assignable to type 'number | undefined'.

// 4. Pick<…> for a public card view, and a function that produces one:
export type CourseCard = Pick<CourseRecord, "title" | "creditHours">;

export function toCourseCard(course: CourseRecord): CourseCard {
  return {
    title: course.title,
    creditHours: course.creditHours,
  };
}

console.log("Public Course Card:", toCourseCard(updatedCourse));

// 5. Readonly<…> on one object, and one rejected assignment:
type ImmutableCourse = Readonly<CourseRecord>;

const frozenCourse: ImmutableCourse = {
  id: 301,
  title: "Full-Stack TypeScript",
  creditHours: 4,
};

// frozenCourse.title = "Changed Title";
// Error TS2540: Cannot assign to 'title' because it is a read-only property.

// 6. Record<LetterGrade, number> initialized with every grade at 0:
export type LetterGrade = "A" | "B" | "C" | "D" | "F";

const gradeTally: Record<LetterGrade, number> = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  F: 0,
};
gradeTally.A += 12;
gradeTally.B += 8;
console.log("Grade Tally:", gradeTally);

// 7. ReturnType + Awaited reusing an async function's result type:
async function fetchCourseDetails(id: number) {
  return {
    courseId: id,
    title: "Database Engineering",
    syllabus: ["Modeling", "SQL", "Migrations"],
    isPublished: true,
  };
}

// Extracting return types:
type FetchCoursePromise = ReturnType<typeof fetchCourseDetails>; // Promise<{ courseId: number; ... }>
type CourseDetails = Awaited<FetchCoursePromise>; // Unwrapped object type

const courseInfo: CourseDetails = {
  courseId: 10,
  title: "Database Engineering",
  syllabus: ["Indexes", "Optimization"],
  isPublished: true,
};
console.log("Awaited Type Object:", courseInfo.title, courseInfo.syllabus);

// 8. An as const array and a union derived with (typeof X)[number]:
const COURSE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number]; // "beginner" | "intermediate" | "advanced"

const currentLevel: CourseLevel = "intermediate";
console.log("Derived Union Level:", currentLevel);

// const invalidLevel: CourseLevel = "expert";
// Error TS2322: Type '"expert"' is not assignable to type 'CourseLevel'.