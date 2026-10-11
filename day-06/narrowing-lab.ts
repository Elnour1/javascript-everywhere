// ==========================================
// 4.2 — Literal Unions & Exhaustiveness
// ==========================================

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// Switch over LetterGrade with exhaustive never check:
export function describeGrade(grade: LetterGrade): string {
  switch (grade) {
    case "A":
      return "Excellent";
    case "B":
      return "Very Good";
    case "C":
      return "Good";
    case "D":
      return "Pass";
    case "F":
      return "Fail";
    default: {
      const _unreachable: never = grade;
      return _unreachable;
    }
  }
}

// If we delete case "F":
// Error TS2322: Type 'string' (or '"F"') is not assignable to type 'never'.

console.log("Grade evaluation:", describeGrade(letterGrade(85)));

// ==========================================
// 4.3 — Narrowing Patterns
// ==========================================

// 1. parseScore handling every member:
export function parseScore(input: number | string | null | undefined): number | null {
  if (typeof input === "number") {
    // Hover: input is number
    return Number.isNaN(input) ? null : input;
  }

  if (typeof input === "string") {
    // Hover: input is string
    const parsed = Number.parseFloat(input);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (input === null) {
    // Hover: input is null
    return null;
  }

  // Hover: input is undefined
  return null;
}

console.log("parseScore(92):", parseScore(92));
console.log("parseScore('88.5'):", parseScore("88.5"));
console.log("parseScore(null):", parseScore(null));
console.log("parseScore(undefined):", parseScore(undefined));

// 2. string | string[] narrowed with Array.isArray:
export function normalizeTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) {
    // Hover: tags is string[]
    return tags;
  }
  // Hover: tags is string
  return [tags];
}

console.log("normalizeTags single:", normalizeTags("frontend"));
console.log("normalizeTags array:", normalizeTags(["react", "next"]));

// 3. Error | string narrowed with instanceof:
export function extractErrorMessage(errorOrMessage: Error | string): string {
  if (errorOrMessage instanceof Error) {
    // Hover: errorOrMessage is Error
    return errorOrMessage.message;
  }
  // Hover: errorOrMessage is string
  return errorOrMessage;
}

console.log("extract Error:", extractErrorMessage(new Error("Connection reset")));
console.log("extract string:", extractErrorMessage("Plain message"));

// 4. { name } | { title } narrowed with 'in':
type Person = { name: string };
type Article = { title: string };

export function getLabel(entity: Person | Article): string {
  if ("name" in entity) {
    // Hover: entity is Person
    return `Person: ${entity.name}`;
  }
  // Hover: entity is Article
  return `Article: ${entity.title}`;
}

console.log(getLabel({ name: "Nour" }));
console.log(getLabel({ title: "TypeScript Mastery" }));

// ==========================================
// 4.4 — null and undefined
// ==========================================

const studentList = [
  { id: 1, name: "Ali", score: 92 },
  { id: 2, name: "Sara", score: 88 },
];

const foundStudent = studentList.find((s) => s.id === 99); // Type: { id: number; name: string; score: number } | undefined

// Handling .find() result three ways:

// 1. if check:
if (foundStudent) {
  console.log("Way 1 (if):", foundStudent.name);
} else {
  console.log("Way 1 (if): Not found");
}

// 2. Optional chaining (?.):
console.log("Way 2 (?.):", foundStudent?.name);

// 3. Nullish coalescing (??):
const displayName = foundStudent?.name ?? "Anonymous Student";
console.log("Way 3 (??):", displayName);

// Handling undefined from noUncheckedIndexedAccess:
const scores = [100, 95, 90];
const fourthScore = scores[3]; // Inferred type: number | undefined

if (fourthScore !== undefined) {
  console.log("Score found:", fourthScore.toFixed(2));
} else {
  console.log("Score at index 3 is undefined — safely handled without crash.");
}