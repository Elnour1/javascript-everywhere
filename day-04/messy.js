// ==========================================
// 4.1 Build the messy array
// ==========================================
console.log("=== 4.1 Messy Array ===");

const students = [
  // 1 & 2: Missing address entirely
  { id: 1, name: "Farah", scores: [85, 90], attendance: 95 },
  { id: 2, name: "Youssef", scores: [72, 68], attendance: 80 },

  // 3: Has address object, but city is missing
  { id: 3, name: "Kareem", address: { street: "123 Nile St" }, scores: [95], attendance: 88 },

  // 4: Empty scores array
  { id: 4, name: "Salma", address: { city: "Alexandria" }, scores: [], attendance: 75 },

  // 5: Attendance is 0 (Valid score/state, not missing!)
  { id: 5, name: "Mostafa", address: { city: "Giza" }, scores: [60], attendance: 0 }
];

console.log(`Loaded ${students.length} messy student records.\n`);

// ==========================================
// 4.2 Read it without crashing
// ==========================================
console.log("=== 4.2 Safe Property Access ===");

students.forEach((s) => {
  // 1. City safe reading
  const city = s.address?.city ?? "Unknown";

  // 2. First score safe reading
  const firstScore = s.scores?.[0] ?? "No scores yet";

  // 3. Attendance with nullish coalescing (0 is preserved)
  const attendanceSafe = s.attendance ?? "N/A";

  // 4. Attendance with OR operator (0 is falsy, incorrectly replaced by fallback!)
  const attendanceBuggy = s.attendance || "N/A";

  console.log(`${s.name.padEnd(8)} | City: ${city.padEnd(10)} | First Score: ${String(firstScore).padEnd(13)} | Att (??): ${String(attendanceSafe).padEnd(4)} | Att (||): ${attendanceBuggy}`);
});

// Explanation on ?? vs ||:
// The OR operator (||) checks for truthy/falsy values; since 0 evaluates to falsy,
// it mistakenly replaces the valid 0 attendance with "N/A".
// The nullish coalescing operator (??) only triggers for null or undefined, correctly keeping 0.

// ==========================================
// 4.3 Wrap it in functions
// ==========================================
console.log("\n=== 4.3 Safe Wrapper Functions ===");

// 1. getCity: Single return line
const getCity = (student) => student.address?.city ?? "Unknown";

// 2. safeFirstScore: Safe index access with null fallback
const safeFirstScore = (student) => student.scores?.[0] ?? null;

// Testing wrapper functions
console.log("Farah City (no address):    ", getCity(students[0])); // Unknown
console.log("Salma City (valid address): ", getCity(students[3])); // Alexandria
console.log("Salma First Score (empty):  ", safeFirstScore(students[3])); // null
console.log("Farah First Score (valid):  ", safeFirstScore(students[0])); // 85

// 3. Optional Chaining on Methods that might not exist
const studentWithMethod = {
  name: "Nour",
  calculateGpa: () => 3.9
};

const studentWithoutMethod = {
  name: "Ali"
};

console.log("\nCalling optional method with ?.:");
console.log("With method:   ", studentWithMethod.calculateGpa?.()); // 3.9
console.log("Without method:", studentWithoutMethod.calculateGpa?.()); // undefined (Does not throw!)