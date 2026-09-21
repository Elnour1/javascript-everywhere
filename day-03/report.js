
function isValidScore(score) {
  return typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;
}

function letterGrade(score) {
  if (!isValidScore(score)) return "F";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function isPassing(score, passMark = 60) {
  return isValidScore(score) && score >= passMark;
}

function isAtRisk(student) {
  return student.score < 60 || student.attendance < 70;
}

function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function highest(students) {
  if (!students || students.length === 0) return null;
  let topStudent = students[0];
  for (let i = 1; i < students.length; i++) {
    if (students[i].score > topStudent.score) topStudent = students[i];
  }
  return topStudent;
}

function lowest(students) {
  if (!students || students.length === 0) return null;
  let bottomStudent = students[0];
  for (let i = 1; i < students.length; i++) {
    if (students[i].score < bottomStudent.score) bottomStudent = students[i];
  }
  return bottomStudent;
}

function countByGrade(students) {
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of students) {
    const grade = letterGrade(s.score);
    if (counts[grade] !== undefined) counts[grade]++;
  }
  return counts;
}

function formatRow(student) {
  const name = student.name.padEnd(16, " ");
  const score = String(student.score).padStart(5, " ");
  const grade = letterGrade(student.score).padStart(5, " ");
  const status = (isPassing(student.score) ? "Pass" : "Fail").padStart(6, " ");
  const attendance = `${student.attendance}%`.padStart(11, " ");
  const atRisk = (isAtRisk(student) ? "YES" : "NO").padStart(8, " ");

  return `${name} | ${score} | ${grade} | ${status} | ${attendance} | ${atRisk}`;
}

const rawStudents = [
  { name: "Ali Mansour", score: 92, attendance: 95 },
  { name: "Sara Ahmad", score: 84, attendance: 88 },
  { name: "Omar Tarek", score: 58, attendance: 75 },
  { name: "Corrupt Rec 1", score: "ninety", attendance: 80 }, // Broken: string score
  { name: "Mona Khaled", score: 77, attendance: 65 }, // At risk (attendance < 70)
  { name: "Hassan Adel", score: 45, attendance: 50 }, // At risk (both)
  { name: "Laila Sherif", score: 96, attendance: 98 },
  { name: "Corrupt Rec 2", score: null, attendance: 90 }, // Broken: null score
  { name: "Ziad Yasser", score: 68, attendance: 82 },
  { name: "Nouran Ezz", score: 89, attendance: 91 },
  { name: "Karim Safwat", score: 73, attendance: 85 },
  { name: "Dina Mostafa", score: 62, attendance: 72 }
];

const validStudents = [];
let skippedCount = 0;

const header = `${"Student Name".padEnd(16, " ")} | ${"Score".padStart(5, " ")} | ${"Grade".padStart(5, " ")} | ${"Status".padStart(6, " ")} | ${"Attendance".padStart(11, " ")} | ${"At Risk?".padStart(8, " ")}`;
console.log(header);
console.log("-".repeat(header.length));

for (const student of rawStudents) {
  if (!isValidScore(student.score) || typeof student.attendance !== "number") {
    skippedCount++;
    continue; // Skip invalid records
  }
  validStudents.push(student);
  console.log(formatRow(student));
}

console.log("-".repeat(header.length));

const scoresOnly = validStudents.map((s) => s.score);
const avgScore = average(scoresOnly).toFixed(1);
const topStudent = highest(validStudents);
const bottomStudent = lowest(validStudents);
const gradeCounts = countByGrade(validStudents);
const atRiskCount = validStudents.filter((s) => isAtRisk(s)).length;

console.log(`* Valid Records Processed : ${validStudents.length}`);
console.log(`* Skipped Invalid Records : ${skippedCount}`);
console.log(`* Class Average Score     : ${avgScore}`);
console.log(`* Highest Performer       : ${topStudent.name} (${topStudent.score})`);
console.log(`* Lowest Performer        : ${bottomStudent.name} (${bottomStudent.score})`);
console.log(`* At-Risk Students Count  : ${atRiskCount}`);
console.log(
  `* Grade Distribution      : A: ${gradeCounts.A} | B: ${gradeCounts.B} | C: ${gradeCounts.C} | D: ${gradeCounts.D} | F: ${gradeCounts.F}`
);
