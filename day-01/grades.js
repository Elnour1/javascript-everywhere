const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
  { name: "Ahmed", score: 71 },
  { name: "Alia", score: 82 }
];

let excellentCount = 0;
let goodCount = 0;
let needsWorkCount = 0;

for (const student of students) {
  if (student.score >= 90) {
    console.log(`${student.name}: ${student.score} → Excellent`);
    excellentCount++;
  } else if (student.score >= 70) {
    console.log(`${student.name}: ${student.score} → Good`);
    goodCount++;
  } else {
    console.log(`${student.name}: ${student.score} → Needs work`);
    needsWorkCount++;
  }
}
console.log(`Summary: ${excellentCount} Excellent, ${goodCount} Good, ${needsWorkCount} Needs work.`);