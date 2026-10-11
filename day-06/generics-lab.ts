// ==========================================
// 8.1 — Generic Functions
// ==========================================

// 1. first<T> and last<T>:
export function first<T>(items: T[]): T | undefined {
  return items[0];
}

export function last<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[items.length - 1] : undefined;
}

// Inferred types commented for 3 different types:
const nFirst = first([10, 20, 30]); // Hover inferred type: number | undefined
const sFirst = first(["React", "Next.js", "TypeScript"]); // Hover inferred type: string | undefined
const bFirst = first([true, false, true]); // Hover inferred type: boolean | undefined

const nLast = last([10, 20, 30]); // Hover inferred type: number | undefined
const sLast = last(["React", "Next.js", "TypeScript"]); // Hover inferred type: string | undefined
const bLast = last([true, false, true]); // Hover inferred type: boolean | undefined

console.log("first & last tests:", { nFirst, sLast, bFirst });

// 2. findById<T extends { id: number }>:
export function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

interface StudentRecord {
  id: number;
  name: string;
  score: number;
}

interface CourseRecord {
  id: number;
  title: string;
}

const students: StudentRecord[] = [
  { id: 1, name: "Sara", score: 92 },
  { id: 2, name: "Omar", score: 85 },
];

const courses: CourseRecord[] = [
  { id: 101, title: "TypeScript In Depth" },
  { id: 102, title: "Next.js Applications" },
];

const foundStudent = findById(students, 1);
const foundCourse = findById(courses, 101);
console.log("findById tests:", foundStudent?.name, foundCourse?.title);

// Constraint rejects items without an 'id' of type number:
// findById([{ label: "No ID" }], 1);
// Error TS2322: Type '{ label: string; }' does not satisfy the constraint '{ id: number; }'. Property 'id' is missing.

// 3. pluck<T, K extends keyof T>:
export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const studentNames = pluck(students, "name"); // Inferred type: string[]
const studentScores = pluck(students, "score"); // Inferred type: number[]
console.log("Plucked names & scores:", studentNames, studentScores);

// Invalid key rejected by TypeScript:
// pluck(students, "nonExistentKey");
// Error TS2345: Argument of type '"nonExistentKey"' is not assignable to parameter of type 'keyof StudentRecord'.

// 4. groupBy<T, K extends string>:
export function groupBy<T, K extends string>(
  items: T[],
  keyOf: (item: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = keyOf(item);
    const group = result[key] ?? [];
    group.push(item);
    result[key] = group;
  }
  return result;
}

type LetterGrade = "A" | "B" | "C";
function getGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "C";
}

const groupedStudents = groupBy(students, (s) => getGrade(s.score));
console.log("Grouped by Grade:", groupedStudents);

// 5. unique<T> using a Set<T>:
export function unique<T>(items: T[]): T[] {
  return Array.from(new Set<T>(items));
}

console.log("Unique numbers:", unique([1, 2, 2, 3, 4, 4, 5]));
console.log("Unique strings:", unique(["a", "b", "a", "c"]));

// ==========================================
// 8.2 — Generic Types
// ==========================================

// 1. type Result<T> as a discriminated union:
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

// 2. safeParse<T>(json, check):
export function safeParse<T>(json: string, check: (data: unknown) => data is T): Result<T> {
  try {
    const raw: unknown = JSON.parse(json);
    if (check(raw)) {
      return { ok: true, value: raw };
    }
    return { ok: false, error: "Parsed JSON does not match the expected schema" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Invalid JSON syntax: ${message}` };
  }
}

function isStudent(data: unknown): data is StudentRecord {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.id === "number" && typeof obj.name === "string" && typeof obj.score === "number";
}

// Tested with valid, wrong-shaped, and invalid JSON:
const resValid = safeParse('{"id":3,"name":"Ali","score":88}', isStudent);
const resWrongShape = safeParse('{"id":3,"name":"Ali"}', isStudent);
const resInvalidJson = safeParse('{"id": bad-json}', isStudent);

console.log("safeParse results:", {
  valid: resValid.ok,
  wrongShape: resWrongShape.ok,
  invalidJson: resInvalidJson.ok,
});

// 3. Proved reading result.value without checking result.ok is an error:
// const unsafeValue = resValid.value;
// Error TS2339: Property 'value' does not exist on type 'Result<StudentRecord>'.
// (Must narrow on res.ok first):
if (resValid.ok) {
  console.log("Safely accessed result.value:", resValid.value.name);
}

// 4. Generic interface Store<T extends { id: number }>:
export interface Store<T extends { id: number }> {
  add(item: T): void;
  get(id: number): T | undefined;
  all(): T[];
  remove(id: number): boolean;
}

// 5. createStore<T>() with closure over Map<number, T>:
export function createStore<T extends { id: number }>(): Store<T> {
  const items = new Map<number, T>();

  return {
    add(item: T): void {
      items.set(item.id, item);
    },
    get(id: number): T | undefined {
      return items.get(id);
    },
    all(): T[] {
      return Array.from(items.values());
    },
    remove(id: number): boolean {
      return items.delete(id);
    },
  };
}

// Two stores for two tables:
const studentStore = createStore<StudentRecord>();
const courseStore = createStore<CourseRecord>();

studentStore.add({ id: 1, name: "Sara", score: 92 });
courseStore.add({ id: 101, title: "TypeScript Generics" });

console.log("Stores initialized. Student store items:", studentStore.all().length);

// 6. Adding the wrong shape to a store (Recorded error):
// studentStore.add({ id: 99, title: "Invalid shape for student" });
// Error TS2345: Argument of type '{ id: number; title: string; }' is not assignable to parameter of type 'StudentRecord'. Property 'score' is missing.

// ==========================================
// 8.3 — Generic Async
// ==========================================

// Safe error message extractor handling 'unknown':
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// 1. withTimeout<T>:
export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

// 2. retry<T> (No missing-return error and no err.message on unknown):
export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Failed after ${times} retries. Last error: ${getErrorMessage(lastError)}`);
}

// 3. mapAsync<T, U> using Promise.all:
export async function mapAsync<T, U>(items: T[], fn: (item: T) => Promise<U>): Promise<U[]> {
  return Promise.all(items.map((item) => fn(item)));
}

// 4. Calling all three on database simulation functions:
async function dbFetchStudent(id: number): Promise<StudentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const s = studentStore.get(id);
  if (!s) throw new Error(`Student ${id} not found in DB`);
  return s;
}

async function runAsyncDemos(): Promise<void> {
  console.log("\n--- Running Generic Async Demos ---");

  // withTimeout (Hovering over t1 shows Promise<StudentRecord>):
  const student = await withTimeout(dbFetchStudent(1), 1000);
  console.log("withTimeout fetched:", student.name);

  // retry:
  let attemptCount = 0;
  const retriedStudent = await retry(async () => {
    attemptCount++;
    if (attemptCount < 2) throw new Error("Temporary network glitch");
    return dbFetchStudent(1);
  }, 3);
  console.log("retry succeeded on attempt:", attemptCount, "for", retriedStudent.name);

  // mapAsync:
  const ids = [1];
  const mappedStudents = await mapAsync(ids, async (id) => dbFetchStudent(id));
  console.log("mapAsync results:", mappedStudents.map((s) => s.name));
}

void runAsyncDemos();