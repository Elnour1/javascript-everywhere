
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
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  const total = numbers.reduce((sum, n) => sum + n, 0);
  return total / numbers.length;
}
function highest(students) {
  if (!students || students.length === 0) return null;
  let topStudent = students[0];
  for (let i = 1; i < students.length; i++) {
    if (students[i].score > topStudent.score) {
      topStudent = students[i];
    }
  }
  return topStudent;
}

function lowest(students) {
  if (!students || students.length === 0) return null;
  let bottomStudent = students[0];
  for (let i = 1; i < students.length; i++) {
    if (students[i].score < bottomStudent.score) {
      bottomStudent = students[i];
    }
  }
  return bottomStudent;
}

function countByGrade(students) {
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of students) {
    const grade = letterGrade(s.score);
    if (counts[grade] !== undefined) {
      counts[grade]++;
    }
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