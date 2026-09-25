/**
 * grade-lib.js — Pure Grading Library (ES2020+ Modern Syntax)
 * Pure functions only: No side effects, no console.log
 */

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

// Destructured parameter with default passMark
function isPassing({ score, passMark = 60 }) {
  return isValidScore(score) && score >= passMark;
}

// Destructured with defaults on both properties
function isAtRisk({ score = 0, attendance = 0 } = {}) {
  return score < 60 || attendance < 70;
}

// Guard clause against empty/invalid array
function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// Single traversal returning [lowest, highest]
function minMaxStudent(students) {
  if (!Array.isArray(students) || students.length === 0) return [null, null];
  let low = students[0];
  let high = students[0];

  for (const s of students) {
    if (s.score < low.score) low = s;
    if (s.score > high.score) high = s;
  }
  return [low, high];
}

// Built with computed property keys and nullish coalescing
function countByGrade(students) {
  const tally = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of students) {
    const grade = letterGrade(s.score);
    tally[grade] = (tally[grade] ?? 0) + 1;
  }
  return tally;
}

// Destructured parameter, pure template literals, padEnd / padStart
function formatRow({ name = "Unknown", score = 0, attendance = 0 } = {}) {
  const paddedName = name.padEnd(16, " ");
  const paddedScore = String(score).padStart(5, " ");
  const grade = letterGrade(score).padStart(5, " ");
  const status = (isPassing({ score }) ? "PASS" : "FAIL").padStart(6, " ");
  const paddedAtt = `${attendance}%`.padStart(11, " ");
  const riskStatus = (isAtRisk({ score, attendance }) ? "YES" : "NO").padStart(8, " ");

  return `${paddedName} | ${paddedScore} | ${grade} | ${status} | ${paddedAtt} | ${riskStatus}`;
}

// Returns a new student copy with updated score, strictly no mutation
function withBonus(student, bonus = 5) {
  const rawScore = student.score + bonus;
  const newScore = Math.min(100, Math.max(0, rawScore));
  return { ...student, score: newScore };
}

// Returns a copy with the target property stripped via rest pattern
function withoutField(student, field) {
  const copy = { ...student };
  delete copy[field];
  return copy;
}

module.exports = {
  isValidScore,
  letterGrade,
  isPassing,
  isAtRisk,
  average,
  minMaxStudent,
  countByGrade,
  formatRow,
  withBonus,
  withoutField
};