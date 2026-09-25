// 2.1 Objects, four ways
// ==========================================

const student = { name: "Sara", score: 92, city: "Cairo" };

// 1. Pulled name and score out in one line
const { name, score } = student;
console.log("Name & Score:", name, score);

// 2. Pulled city out renamed to hometown
const { city: hometown } = student;
console.log("Hometown:", hometown);

// 3. Pulled missing attendance with default of 0
const { attendance = 0 } = student;
console.log("Attendance (defaulted):", attendance);

// 4. Renamed and defaulted in one declaration
const { level: tier = "Standard" } = student;
console.log("Tier (renamed & defaulted):", tier);

// 2.2 Nested
// ==========================================
const user = {
  id: 101,
  profile: {
    email: "sara@example.com",
    github: "sara-dev"
  }
};

const { profile: { email } } = user;
console.log("Extracted email:", email);
try {
  console.log(profile);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}

const { profile, profile: { email: directEmail } } = user;
console.log("Both profile object and email:", profile, directEmail);

// 2.3 Arrays
// ==========================================

const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid"];

// 1. Destructure first two items
const [first, second] = frameworks;
console.log("First two:", first, second);

// 2. Skip commas to grab fourth item
const [, , , fourth] = frameworks;
console.log("Fourth item:", fourth);

// 3. Sixth position with a default
const [, , , , , sixth = "Next.js"] = frameworks;
console.log("Sixth item (defaulted):", sixth);

// 4. Swap two variables without temporary variable
let valA = "Alpha";
let valB = "Omega";
[valA, valB] = [valB, valA];
console.log("Swapped values:", valA, valB);

// 5. Head and rest (tail)
const [head, ...tail] = frameworks;
console.log("Head:", head);
console.log("Tail:", tail);

// 2.4 Parameters
// ==========================================

// describe with destructuring and default city parameter
function describe({ name, score, city = "Unknown" }) {
  return `${name} from ${city} scored ${score}`;
}

console.log(describe({ name: "Omar", score: 88, city: "Alexandria" }));
console.log(describe({ name: "Laila", score: 95 }));

// summarise with defensive default empty object
function summarise({ name = "Anonymous", score = 0, passMark = 60 } = {}) {
  const status = score >= passMark ? "PASS" : "FAIL";
  return `${name}: ${score} points -> ${status}`;
}

// All three calls work seamlessly:
console.log("Full:   ", summarise({ name: "Ziad", score: 75, passMark: 70 }));
console.log("Partial:", summarise({ name: "Mona" }));
console.log("Empty:  ", summarise());

// Demonstration of what happens when '= {}' is omitted:
function unsafeSummarise({ name, score }) {
  return `${name}: ${score}`;
}

try {
  unsafeSummarise(); // Throws TypeError: Cannot destructure property of undefined
} catch (err) {
  console.log("Without default object fallback ->", `${err.name}: ${err.message}`);
}

// 2.5 In a loop
// ==========================================

const students = [
  { name: "Ali", score: 95 },
  { name: "Mariam", score: 82 },
  { name: "Tamer", score: 58 },
  { name: "Nour", score: 91 }
];

console.log("Student list:");
for (const { name, score } of students) {
  console.log(`- ${name.padEnd(8)}: ${score}`);
}

// Build a grade tally
const tally = { A: 0, B: 0, F: 0 };
for (const { score } of students) {
  if (score >= 90) tally.A++;
  else if (score >= 80) tally.B++;
  else tally.F++;
}

console.log("\nGrade Tally Breakdown:");
for (const [grade, count] of Object.entries(tally)) {
  console.log(`Grade ${grade}: ${count} student(s)`);
}