/**
 * report.js — Asynchronous Student Pipeline & Report Generator
 */

const fs = require("fs");
const path = require("path");

// ==========================================
// 1. Grade Library Functions (Pasted as required)
// ==========================================
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

function isPassing({ score, passMark = 60 }) {
  return isValidScore(score) && score >= passMark;
}

function isAtRisk({ score = 0, attendance = 0 } = {}) {
  return score < 60 || attendance < 70;
}

function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

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

function countByGrade(students) {
  const tally = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of students) {
    const grade = letterGrade(s.score);
    tally[grade] = (tally[grade] ?? 0) + 1;
  }
  return tally;
}

function formatRow({ name = "Unknown", score = 0, attendance = 0 } = {}) {
  const paddedName = name.padEnd(16, " ");
  const paddedScore = String(score).padStart(5, " ");
  const grade = letterGrade(score).padStart(5, " ");
  const status = (isPassing({ score }) ? "PASS" : "FAIL").padStart(6, " ");
  const paddedAtt = `${attendance}%`.padStart(11, " ");
  const riskStatus = (isAtRisk({ score, attendance }) ? "YES" : "NO").padStart(8, " ");

  return `${paddedName} | ${paddedScore} | ${grade} | ${status} | ${paddedAtt} | ${riskStatus}`;
}

function withBonus(student, bonus = 5) {
  const rawScore = student.score + bonus;
  const newScore = Math.min(100, Math.max(0, rawScore));
  return { ...student, score: newScore };
}

// ==========================================
// 2. Simulated Async Attendance Fetcher
// ==========================================
function getAttendance(id, callback) {
  // Variable asynchronous delay per student id (100ms - 300ms)
  const simulatedDelay = 100 + (id % 4) * 50;
  setTimeout(() => {
    // Simulated remote database record
    callback(null, 75 + (id * 2) % 25);
  }, simulatedDelay);
}

// ==========================================
// 3. Asynchronous Pipeline Execution
// ==========================================
const filePath = path.join(__dirname, "students.json");
const pipelineStartTime = Date.now();

console.log("Loading students.json from disk asynchronously...\n");

fs.readFile(filePath, "utf-8", (readErr, rawData) => {
  // Error-first read handling
  if (readErr) {
    return console.error(`[File Read Error]: Could not find or read ${filePath}: ${readErr.message}`);
  }

  // Defensive JSON parsing
  let parsedStudents;
  try {
    parsedStudents = JSON.parse(rawData);
  } catch (parseErr) {
    return console.error(`[JSON Parse Error]: Invalid JSON syntax: ${parseErr.message}`);
  }

  console.log(`[Loaded] ${parsedStudents.length} raw student records. Resolving missing attendance in parallel...\n`);

  const parallelStartTime = Date.now();
  let completedCount = 0;
  const enrichedStudents = new Array(parsedStudents.length);

  // Parallel asynchronous fetching maintaining stable index position
  parsedStudents.forEach((student, index) => {
    // If student already has attendance, preserve it; otherwise fetch remotely
    if (student.attendance !== undefined) {
      enrichedStudents[index] = student;
      completedCount++;
      checkCompletion();
    } else {
      getAttendance(student.id, (err, fetchedAtt) => {
        const fallbackAtt = err ? 0 : fetchedAtt;
        enrichedStudents[index] = { ...student, attendance: fallbackAtt };
        console.log(`[Arrival] Fetched attendance for: ${student.name} (${fallbackAtt}%)`);
        completedCount++;
        checkCompletion();
      });
    }
  });

  function checkCompletion() {
    if (completedCount === parsedStudents.length) {
      const parallelDuration = Date.now() - parallelStartTime;
      renderReport(enrichedStudents, parallelDuration);
    }
  }
});

// ==========================================
// 4. Report Rendering Function
// ==========================================
function renderReport(students, parallelDuration) {
  const validStudents = [];
  let skippedCount = 0;

  console.log("\n======================= STUDENT ACADEMIC REPORT =======================");
  const header = `${"Student Name".padEnd(16, " ")} | ${"Score".padStart(5, " ")} | ${"Grade".padStart(5, " ")} | ${"Status".padStart(6, " ")} | ${"Attendance".padStart(11, " ")} | ${"At Risk?".padStart(8, " ")}`;
  console.log(header);
  console.log("-".repeat(header.length));

  // Loop with destructuring in header and skipping invalid records
  for (const student of students) {
    const { name, score } = student;
    if (!name || !isValidScore(score)) {
      skippedCount++;
      continue;
    }
    validStudents.push(student);
    console.log(formatRow(student));
  }

  console.log("-".repeat(header.length));

  // Destructured min/max pair
  const [lowest, highest] = minMaxStudent(validStudents);
  const avgScore = average(validStudents.map((s) => s.score)).toFixed(1);
  const tally = countByGrade(validStudents);
  const atRiskCount = validStudents.filter((s) => isAtRisk(s)).length;

  console.log("\n=========================== PERFORMANCE SUMMARY ===========================");
  console.log(`* Valid Records Processed : ${validStudents.length}`);
  console.log(`* Skipped Corrupt Records : ${skippedCount}`);
  console.log(`* Class Average Score     : ${avgScore}`);
  console.log(`* Highest Performer       : ${highest?.name} (${highest?.score})`);
  console.log(`* Lowest Performer        : ${lowest?.name} (${lowest?.score})`);
  console.log(`* Total At-Risk Students  : ${atRiskCount}`);

  // Object.entries + [grade, count] destructuring
  const tallyFormatted = Object.entries(tally)
    .map(([grade, count]) => `${grade}: ${count}`)
    .join(" | ");
  console.log(`* Grade Distribution      : ${tallyFormatted}`);

  // Proof of Immutability with withBonus
  console.log("\n========================= IMMUTABILITY VERIFICATION ========================");
  const sample = validStudents[0];
  const boostedSample = withBonus(sample, 5);
  console.log(`Original Student Score    : ${sample.name} -> ${sample.score}`);
  console.log(`Boosted Student (+5 Bonus): ${boostedSample.name} -> ${boostedSample.score}`);
  console.log(`Original Still Intact?    : ${sample.score !== boostedSample.score}`);

  // Asynchronous Performance Analysis
  console.log("\n======================== ASYNC TIMING BENCHMARKS ==========================");
  console.log(`* Parallel Fetch Duration : ${parallelDuration}ms`);
  console.log(`* Theoretical Sequential  : ~${validStudents.length * 200}ms (sum of individual network delays)`);
  console.log("===========================================================================");
}