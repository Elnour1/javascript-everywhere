// ==========================================
// 4.1 — functions-lab.ts
// ==========================================

// 1. Typed parameters and return — function declaration and arrow function:
function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal + subtotal * taxRate;
}

const calculateTotalArrow = (subtotal: number, taxRate: number): number => {
  return subtotal + subtotal * taxRate;
};

console.log("Function:", calculateTotal(100, 0.14));
console.log("Arrow Function:", calculateTotalArrow(100, 0.14));

// 2. Default and optional parameter with ?? operator:
function createGreeting(name: string, prefix = "Welcome", suffix?: string): string {
  const finalSuffix = suffix ?? "!";
  return `${prefix}, ${name}${finalSuffix}`;
}

console.log(createGreeting("Nour")); // Uses default prefix and ?? fallback
console.log(createGreeting("Sara", "Hello", " :)"));

// 3. Rest parameter called with 0, 1, and 5 arguments:
function sumScores(...scores: number[]): number {
  return scores.reduce((sum, current) => sum + current, 0);
}

console.log("Zero args:", sumScores());
console.log("One arg:", sumScores(85));
console.log("Five args:", sumScores(90, 80, 95, 70, 100));

// 4. Function with destructured object parameter:
type TaskPayload = {
  title: string;
  points: number;
  completed?: boolean;
};

function displayTask({ title, points, completed = false }: TaskPayload): string {
  return `Task: "${title}" [${points} pts] - Status: ${completed ? "Done" : "Pending"}`;
}

console.log(displayTask({ title: "Setup Project", points: 10 }));

// 5. Function type alias and two functions fitting it:
type TransformString = (input: string) => string;

const toSlug: TransformString = (text) => text.toLowerCase().replace(/\s+/g, "-");
const toShout: TransformString = (text) => `${text.toUpperCase()}!!!`;

console.log(toSlug("TypeScript Lab Setup"));
console.log(toShout("TypeScript Lab Setup"));

// 6. Function taking that callback type (contextual typing):
function processLabel(value: string, transformer: TransformString): string {
  return transformer(value);
}

// Hover over 'item' inside the callback: TS infers (item: string) without explicit annotation:
console.log(processLabel("Hello World", (item) => item.trim()));

// 7. Async function returning Promise and error without await:
async function fetchUserScore(userId: number): Promise<number> {
  return 95 + userId;
}

// const unawaitedScore: number = fetchUserScore(1);
// Error TS2322: Type 'Promise<number>' is not assignable to type 'number'.
async function runAsyncDemo(): Promise<void> {
  const awaitedScore: number = await fetchUserScore(1);
  console.log("Awaited Score:", awaitedScore);
}
void runAsyncDemo();

// 8. Overloaded function with two signatures:
function getSummary(id: number): string;
function getSummary(names: string[]): number;
function getSummary(arg: number | string[]): string | number {
  if (typeof arg === "number") {
    return `Summary for ID #${arg}`;
  }
  return arg.length;
}

// Hover over r1: string | Hover over r2: number
const r1 = getSummary(42);
const r2 = getSummary(["Sara", "Ali", "Omar"]);
console.log("Overload 1:", r1);
console.log("Overload 2:", r2);

// 9. Recorded errors: wrong count and wrong type:
// calculateTotal(100);
// Error TS2554: Expected 2 arguments, but got 1.

// calculateTotal(100, "0.14");
// Error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// Fixed calls:
console.log("Fixed call:", calculateTotal(100, 0.14));