// ==========================================
// 2.1 — Annotate and Infer
// ==========================================

// 1. Five variables without annotations & their inferred types:
let studentName = "Nour"; // Inferred type: string
let finalScore = 98; // Inferred type: number
let isEnrolled = true; // Inferred type: boolean
let registeredCourses = ["TypeScript", "Next.js", "React"]; // Inferred type: string[]
const instituteBranch = "Qena"; // Inferred type: "Qena" (literal type)

// 2. One annotation TS could infer & reason to omit:
const userRole: string = "Frontend Developer";
// Comment: Redundant annotation; TS easily infers primitive string types from initializers, keeping code cleaner.

// 3. Reassigning let number to string (Error recorded & commented out):
let sessionCount = 12;
// sessionCount = "twelve";
// Error TS2322: Type 'string' is not assignable to type 'number'.

// 4. let vs const hover difference:
let statusLetter = "A"; // Hover: string (Type Widening: variable can change to any string later)
const fixedGrade = "A"; // Hover: "A" (Literal Type: constant cannot change, narrowed to exact value)

console.log("--- 2.1 Complete ---");

// ==========================================
// 2.2 — The Primitives
// ==========================================

// 1. Template literal string & 3 string methods:
const projectTitle = `Web Application for ${studentName}`;
console.log(projectTitle.toUpperCase());
console.log(projectTitle.includes("Web"));
console.log(projectTitle.replace("Web", "Full-Stack"));

// 2. Three numbers & expressions:
const wholeNumber = 42;
const decimalNumber = 3.14;
const negativeNumber = -15;

console.log(0.1 + 0.2); // Prints 0.30000000000000004 (IEEE 754 floating-point binary representation limit)
console.log(10 / 0); // Prints Infinity (division by zero in JS evaluates to Infinity, not a crash)
console.log(Number("abc")); // Prints NaN (parsing invalid string produces Not-a-Number)

// 3. Boolean computed from comparison:
const hasPassed: boolean = finalScore >= 60;
console.log("Passed:", hasPassed);

// 4. BigInt calculation & rejected mix:
const bigId: bigint = 9007199254740993n; // Greater than Number.MAX_SAFE_INTEGER (9007199254740991)
const nextBigId = bigId + 10n; // Correct calculation with BigInt
console.log("BigInt Result:", nextBigId);

// const invalidBigMix = bigId + 5;
// Error TS2365: Operator '+' cannot be applied to types 'bigint' and 'number'.

// 5. Two symbols with the same description:
const symKey1: symbol = Symbol("task");
const symKey2: symbol = Symbol("task");
console.log("Symbols unequal:", symKey1 !== symKey2); // Always true, symbols have unique identity // Always true, symbols have unique identity

// 6. string | null vs string | undefined:
let middleName: string | null = null; // Use null for deliberate absence of a value (e.g. form field left blank)
let nickname: string | undefined = undefined; // Use undefined for uninitialized/optional values

// 7. Assigning null to plain string (Error recorded & commented out):
let requiredField: string = "Essential";
// requiredField = null;
// Error TS2322: Type 'null' is not assignable to type 'string' (with strictNullChecks enabled).

console.log("--- 2.2 Complete ---");

// ==========================================
// 2.3 — Arrays, Tuples, Objects
// ==========================================

// 1. number[] with map, filter, reduce:
const examScores: number[] = [88, 92, 75, 99, 82];

const curvedScores = examScores.map((s) => s + 2); // Inferred type: number[]
const honors = examScores.filter((s) => s >= 90); // Inferred type: number[]
const totalMarks = examScores.reduce((acc, curr) => acc + curr, 0); // Inferred type: number

console.log({ curvedScores, honors, totalMarks });

// 2. Empty arrays with & without annotation:
const inferredEmpty = []; // Inferred type: any[] (evolves to any without explicit typing)
const typedEmpty: string[] = []; // Inferred type: string[] (safely restricted to strings)

// 3. Mixed array vs incorrect union mistake:
const mixedArr: (string | number)[] = ["React", 101, "Next", 202];
// const arrayUnionMistake: string | number[] = ["oops"];
// Error TS2322: Type 'string[]' is not assignable to type 'string | number[]' (means either a string OR array of numbers).

// 4. Readonly array and rejected push:
const immutableScores: readonly number[] = [95, 90, 85];
// immutableScores.push(100);
// Error TS2339: Property 'push' does not exist on type 'readonly number[]'.

// 5. Named tuple with optional element & destructuring function:
type StudentTuple = [id: number, name: string, honors?: boolean];

function getTopStudent(): StudentTuple {
  return [101, "Sara", true];
}
const [studentId, topName, isHonor] = getTopStudent();
console.log("Tuple destructured:", studentId, topName, isHonor);

// 6. Nested object type with optional property & array of objects:
type Project = {
  title: string;
  version?: string; // Optional property
  metadata: {
    author: string;
    contributors: { id: number; name: string }[];
  };
};

const myApp: Project = {
  title: "Task Planner",
  metadata: {
    author: "Nour",
    contributors: [
      { id: 1, name: "Ali" },
      { id: 2, name: "Mona" },
    ],
  },
};
console.log("Project Object:", myApp.title, myApp.metadata.contributors.length);

// 7. Extra property rejected (Excess property check):
// const brokenProject: Project = {
//   title: "Bad App",
//   metadata: { author: "Nour", contributors: [] },
//   extraNotes: "Not allowed",
// };
// Error TS2353: Object literal may only specify known properties, and 'extraNotes' does not exist in type 'Project'.

console.log("--- 2.3 Complete ---");

// ==========================================
// 2.4 — Conversions and typeof
// ==========================================

// 1. Converting "68" three ways:
const strVal = "68";
const n1 = Number(strVal);
const n2 = Number.parseInt(strVal, 10);
const n3 = +strVal;
console.log({ n1, n2, n3 });

// Input where they differ:
const mixedInput = "68px";
console.log(Number(mixedInput)); // NaN (rejects trailing non-numeric characters)
console.log(Number.parseInt(mixedInput, 10)); // 68 (parses until first invalid character)
console.log(+mixedInput); // NaN (unary plus behaves like Number())

// 2. Number to string & 5 values to booleans (all falsies included):
const numStr = (256).toString();
console.log("Num to String:", numStr);

console.log("Boolean(0):", Boolean(0)); // falsy
console.log("Boolean(''):", Boolean("")); // falsy
console.log("Boolean(null):", Boolean(null)); // falsy
console.log("Boolean(undefined):", Boolean(undefined)); // falsy
console.log("Boolean(NaN):", Boolean(NaN)); // falsy
console.log("Boolean('Active'):", Boolean("Active")); // truthy

// 3. typeof table:
console.log("typeof string:", typeof "hello");
console.log("typeof number:", typeof 100);
console.log("typeof boolean:", typeof true);
console.log("typeof bigint:", typeof 100n);
console.log("typeof symbol:", typeof Symbol());
console.log("typeof undefined:", typeof undefined);
console.log("typeof null:", typeof null); // Prints "object" — Historic JavaScript bug that cannot be fixed without breaking existing code.

// 4. Proving type annotation does NOT convert values at runtime:
const fakeNumber: number = "5" as unknown as number;
console.log("Annotated '5' typeof:", typeof fakeNumber); // Prints "string" — TS types exist only at compile time; runtime JS remains unchanged!