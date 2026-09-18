
const students = [
  { name: "Nouran Ali", score: 94, attendance: 92 },
  { name: "Omar Farouk", score: 82, attendance: 85 },
  { name: "Youssef Tarek", score: 76, attendance: 68 }, 
  { name: "Salma Samir", score: 63, attendance: 75 },
  { name: "Khaled Hassan", score: 54, attendance: 90 }, 
  { name: "Hoda Mostafa", score: 88, attendance: 81 },
  { name: "Rami Adel", score: 45, attendance: 50 },    
  { name: "Bad Data", score: 120, attendance: 95 },   
  { name: "Mona Zakaria", score: 91, attendance: 96 }
];

const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
let totalScore = 0;
let validStudentCount = 0;
let atRiskCount = 0;
let skippedCount = 0;

let highestStudent = null;
let lowestStudent = null;

console.log(
  "Name".padEnd(18) +
  "Score".padStart(6) +
  "Attendance".padStart(13) +
  "Grade".padStart(8) +
  "   " +
  "Status".padEnd(15)
);
console.log("-".repeat(60));

for (const student of students) {
  const score = student.score;
  const attendance = student.attendance;
  const name = student.name;

  if (
    typeof score !== "number" ||
    typeof attendance !== "number" ||
    score < 0 ||
    score > 100 ||
    attendance < 0 ||
    attendance > 100
  ) {
    skippedCount++;
    continue; 
  }

  let letterGrade = "";
  if (score >= 90) {
    letterGrade = "A";
  } else if (score >= 80) {
    letterGrade = "B";
  } else if (score >= 70) {
    letterGrade = "C";
  } else if (score >= 60) {
    letterGrade = "D";
  } else {
    letterGrade = "F";
  }
  gradeCounts[letterGrade]++;

  let status = "In good standing";
  if (score < 60 || attendance < 70) {
    status = "At risk";
    atRiskCount++;
  }

  totalScore += score;
  validStudentCount++;

  if (highestStudent === null || score > highestStudent.score) {
    highestStudent = { name, score };
  }
  if (lowestStudent === null || score < lowestStudent.score) {
    lowestStudent = { name, score };
  }

  console.log(
    `${name.padEnd(18)}${String(score).padStart(6)}${`${attendance}%`.padStart(13)}${letterGrade.padStart(8)}   ${status.padEnd(15)}`
  );
}

const classAverage = validStudentCount > 0 
  ? (totalScore / validStudentCount).toFixed(1) 
  : "0.0";

console.log("=".repeat(60));
console.log("CLASS SUMMARY REPORT");
console.log("-".repeat(60));
console.log(`Grade Distribution : A: ${gradeCounts.A} | B: ${gradeCounts.B} | C: ${gradeCounts.C} | D: ${gradeCounts.D} | F: ${gradeCounts.F}`);
console.log(`Class Average      : ${classAverage}`);
console.log(`Highest Scorer     : ${highestStudent.name} (${highestStudent.score})`);
console.log(`Lowest Scorer      : ${lowestStudent.name} (${lowestStudent.score})`);
console.log(`Students At Risk   : ${atRiskCount}`);
console.log(`Skipped Records    : ${skippedCount}`);
console.log("=".repeat(60));
