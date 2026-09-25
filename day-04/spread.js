// ==========================================
// 3.1 Copy vs alias
// ==========================================
console.log("=== 3.1 Copy vs alias ===");

const originalArr = [1, 2, 3];

// Alias (shared reference pointer)
const alias = originalArr;
alias.push(4);
console.log("Original mutated via alias:", originalArr); // [1, 2, 3, 4]

// True independent copy using spread
const trueCopy = [...originalArr];
trueCopy.push(99);
console.log("Original untouched after copy push:", originalArr); // [1, 2, 3, 4]
console.log("True copy contents:             ", trueCopy); // [1, 2, 3, 4, 99]

// Difference in one sentence:
// An alias merely copies the memory reference pointing to the existing array,
// whereas spread allocates a brand-new array structure on the heap.

// ==========================================
// 3.2 Arrays without mutation
// ==========================================
console.log("\n=== 3.2 Arrays without mutation ===");

const listA = ["HTML", "CSS"];
const listB = ["JavaScript", "TypeScript"];

// 1. Combine arrays
const combined = [...listA, ...listB];
console.log("Combined:", combined);

// 2. Add to end and front
const addedToEnd = [...combined, "React"];
const addedToFront = ["Git", ...combined];
console.log("Added to front:    ", addedToFront);
console.log("Added to end:      ", addedToEnd);
console.log("Original untouched:", combined.length); // 4

// 3. Remove by index without mutating original (e.g. remove index 2 -> "JavaScript")
const removeIndex = 2;
const withoutItem = [
  ...combined.slice(0, removeIndex),
  ...combined.slice(removeIndex + 1)
];
console.log("Removed index 2:   ", withoutItem);
console.log("Original length:   ", combined.length); // Still 4

// ==========================================
// 3.3 Objects without mutation
// ==========================================
console.log("\n=== 3.3 Objects without mutation ===");

const student = { name: "Nour", score: 85, attendance: 90 };

// 1. Updated copy with a different score
const updatedStudent = { ...student, score: 95 };
console.log("Original score survived:", student.score); // 85
console.log("Updated copy score:     ", updatedStudent.score); // 95

// 2. Add a new field
const studentWithId = { id: "STD-2026", ...student };
console.log("With ID:", studentWithId);

// 3. Remove a field using object rest
const { attendance, ...withoutAttendance } = student;
console.log("Without attendance field:", withoutAttendance);

// ==========================================
// 3.4 Merge order
// ==========================================
console.log("\n=== 3.4 Merge order ===");

const defaultSettings = { theme: "light", fontSize: 14, showSidebar: true };
const userCustom = { theme: "dark", fontSize: 18 };

// Correct order: userCustom properties overwrite defaultSettings
const correctConfig = { ...defaultSettings, ...userCustom };
console.log("Correct merge (custom wins):", correctConfig);

// Wrong order: defaults overwrite user preferences
const brokenConfig = { ...userCustom, ...defaultSettings };
console.log("Broken merge (defaults win):", brokenConfig);

// Comment on order:
// We want '{ ...defaults, ...custom }' because JavaScript evaluates properties
// left-to-right; placing defaults second resets user preferences to standard values.

// ==========================================
// 3.5 The shallow copy trap
// ==========================================
console.log("\n=== 3.5 The shallow copy trap ===");

const originalProfile = {
  user: "Amira",
  settings: {
    notifications: true
  }
};

// Shallow copy
const shallowCopy = { ...originalProfile };

// Mutating the nested property
shallowCopy.settings.notifications = false;
console.log("Original accidentally mutated:", originalProfile.settings.notifications); // false (Corrupted!)

// The Fix: Deep copy nested objects via nested spread
const safeOriginal = {
  user: "Amira",
  settings: {
    notifications: true
  }
};

const safeCopy = {
  ...safeOriginal,
  settings: { ...safeOriginal.settings } // Clones the inner object reference
};

safeCopy.settings.notifications = false;
console.log("Original safe after nested spread:", safeOriginal.settings.notifications); // true (Protected!)

// ==========================================
// 3.6 Rest in functions
// ==========================================
console.log("\n=== 3.6 Rest in functions ===");

// 1. Total sum of any count of arguments
function total(...numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log("Total sum:", total(5, 10, 15, 20)); // 50

// 2. logAll with label then items
function logAll(label, ...items) {
  console.log(`[${label}] -> ${items.join(" | ")}`);
}
logAll("Skills", "React", "Next.js", "Tailwind");

// 3. Move first item to end
function moveFirstToEnd(first, ...others) {
  return [...others, first];
}
console.log("Moved first to end:", moveFirstToEnd("A", "B", "C", "D")); // ['B', 'C', 'D', 'A']

// Rest must be last parameter test:
// Putting '...rest' before another parameter triggers:
// SyntaxError: Rest parameter must be last formal parameter
// function invalidSignature(...first, last) {}

// ==========================================
// 3.7 Spread into arguments
// ==========================================
console.log("\n=== 3.7 Spread into arguments ===");

const scores = [88, 94, 76, 99, 82];

// Without spread: Math.max expects separate number arguments, receives an array -> NaN
console.log("Math.max without spread:", Math.max(scores)); // NaN

// With spread: Unpacks array elements into individual positional arguments -> 99
console.log("Math.max with spread:   ", Math.max(...scores)); // 99

// Explanation:
// Without spread, Math.max attempts to coerce the entire array into a single number
// resulting in NaN; spread unpacks the array elements into separate arguments.