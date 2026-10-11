// ==========================================
// 3.1 — any, unknown, void, never
// ==========================================

// 1. One 'any' on purpose, letting a runtime crash through inside try / catch:
try {
  const badAny: any = "Hello World";
  // At compile time, tsc allows calling any arbitrary property or method:
  badAny.nonExistentMethod();
} catch (err) {
  console.log("Caught runtime crash via 'any':", (err as Error).message);
}

// 2. Changed to 'unknown', recorded error, and narrowed until safe:
const safeUnknown: unknown = { title: "Frontend Architecture", views: 1500 };

// Attempting direct access causes an error:
// console.log(safeUnknown.title);
// Error TS18046: 'safeUnknown' is of type 'unknown'.

// Narrowing safely with typeof and 'in':
if (typeof safeUnknown === "object" && safeUnknown !== null && "title" in safeUnknown) {
  // Now tsc allows property access safely:
  console.log("Safely narrowed title:", (safeUnknown as { title: string }).title);
}

// 3. A void function & comment on void vs undefined:
function logNotification(msg: string): void {
  console.log("Notification:", msg);
}
logNotification("Task completed");
// Comment on void vs undefined:
// 'void' tells TypeScript that a function does not return a meaningful value (and callers should ignore it).
// 'undefined' is an actual runtime primitive value that can be assigned, returned, or checked.

// 4. A never function that always throws, used inside try / catch:
function failProcess(reason: string): never {
  throw new Error(`Fatal execution halt: ${reason}`);
}

try {
  failProcess("Unauthorized resource access");
} catch (err) {
  console.log("Caught from 'never' function:", (err as Error).message);
}

// 5. Implicit-any parameter error recorded:
// function calculateScore(score) { return score * 2; }
// Error TS7006: Parameter 'score' implicitly has an 'any' type.

console.log("--- 3.1 Complete ---");

// ==========================================
// 3.2 — Literals, unions, intersections, aliases
// ==========================================

// 1. Two literal unions of my own (strings & numbers), each with invalid value recorded:
type TaskStatus = "pending" | "in-progress" | "completed";
let currentStatus: TaskStatus = "pending";
// currentStatus = "archived";
// Error TS2322: Type '"archived"' is not assignable to type 'TaskStatus'.

type ValidHttpSuccess = 200 | 201 | 204;
let responseCode: ValidHttpSuccess = 200;
// responseCode = 404;
// Error TS2322: Type '404' is not assignable to type 'ValidHttpSuccess'.

// 2. A number | string union and a function that accepts it:
function formatIdentifier(id: number | string): string {
  if (typeof id === "number") {
    return `ID-#${id.toString().padStart(4, "0")}`;
  }
  return `ID-${id.toUpperCase()}`;
}
console.log(formatIdentifier(7));
console.log(formatIdentifier("usr_alpha"));

// 3. Type alias for an object, combined with a second one using &:
type UserProfile = {
  id: number;
  username: string;
};

type UserPermissions = {
  role: "admin" | "editor";
  canPublish: boolean;
};

type AppUser = UserProfile & UserPermissions;

// 4. Variable of intersection type, and one missing property recorded:
const adminUser: AppUser = {
  id: 101,
  username: "nour_dev",
  role: "admin",
  canPublish: true,
};
console.log("Intersection Object:", adminUser.username, adminUser.role);

// const incompleteUser: AppUser = { id: 102, username: "guest", role: "editor" };
// Error TS2741: Property 'canPublish' is missing in type '{ id: number; username: string; role: "editor"; }' but required in type 'UserPermissions'.

console.log("--- 3.2 Complete ---");

// ==========================================
// 3.3 — Enums and as const
// ==========================================

// 1. Enum recording editor/Node issues:
// enum Direction { Up = "UP", Down = "DOWN" }
// Editor/tsc Error (with erasableSyntaxOnly): TS5133: 'enum' declarations are not allowed when 'erasableSyntaxOnly' is enabled.
// Node runtime issue: Enums emit runtime object generation code, breaking type-erasure-only workflows.

// 2. Rebuilt as an 'as const' object + derived union type:
const PriorityLevel = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

type Priority = (typeof PriorityLevel)[keyof typeof PriorityLevel];

// 3. A function taking that union — called with property, plain string, and invalid recorded:
function assignPriority(level: Priority): void {
  console.log("Assigned priority level:", level);
}

assignPriority(PriorityLevel.High); // Called with object property
assignPriority("medium"); // Called with plain string value

// assignPriority("critical");
// Error TS2322: Argument of type '"critical"' is not assignable to parameter of type 'Priority'.

// 4. Hover comment over derived type:
// Hover over 'Priority': type Priority = "low" | "medium" | "high"

console.log("--- 3.3 Complete ---");

// ==========================================
// 3.4 — Assertions
// ==========================================

// 1. 'as' on JSON that matches vs JSON that doesn't:
type CoursePayload = {
  code: string;
  creditHours: number;
};

const validJson = JSON.parse('{"code":"CS101","creditHours":3}') as CoursePayload;
console.log("Matching JSON:", validJson.code, validJson.creditHours);

const invalidJson = JSON.parse('{"code":"CS102"}') as CoursePayload;
// creditHours was omitted, but TS believes it exists:
console.log("Unmatched JSON property:", invalidJson.creditHours); // Prints undefined at runtime!

// 2. Freeze an object with 'as const' and record the error when modifying:
const systemConfig = {
  apiEndpoint: "https://api.example.com",
  timeoutMs: 5000,
} as const;

// systemConfig.timeoutMs = 10000;
// Error TS2540: Cannot assign to 'timeoutMs' because it is a read-only property.

// 3. Non-null assertion (!) crashing when wrong vs proper runtime check:
const userDirectory = new Map<number, string>([[1, "Mona"]]);

try {
  // Intentionally wrong lookup with '!':
  const absentUser = userDirectory.get(99)!;
  // If we try accessing properties/methods, it crashes at runtime:
  console.log("Length with ! assertion:", absentUser.length);
} catch (err) {
  console.log("Non-null assertion crash caught:", (err as Error).message);
}

// Proper runtime check replacement:
const safeLookup = userDirectory.get(99);
if (safeLookup !== undefined) {
  console.log("Found user:", safeLookup);
} else {
  console.log("Proper check: User not found in directory.");
}

// 4. Comment: When 'as' is acceptable vs handling outside data:
// When 'as' is acceptable:
// - Only when you have internal context that the compiler cannot infer (e.g., querying a specific known DOM element in tests).
// What to use for outside data instead:
// - Never use 'as' for external data (APIs, JSON.parse, user input, localStorage).
// - Treat incoming data as 'unknown', and validate shape at runtime using User-defined Type Guards ('value is T') or validation libraries (like Zod).

console.log("--- 3.4 Complete ---");