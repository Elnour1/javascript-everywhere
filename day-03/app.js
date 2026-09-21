
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

function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const total = numbers.reduce((sum, n) => sum + n, 0);
  return total / numbers.length;
}

const students = [];

// DOM References
const nameInput = document.getElementById("studentName");
const scoreInput = document.getElementById("studentScore");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const errorBox = document.getElementById("errorBox");
const studentList = document.getElementById("studentList");
const summaryBox = document.getElementById("summaryBox");

function render() {
  studentList.innerHTML = "";

  for (const student of students) {
    const li = document.createElement("li");
    const grade = letterGrade(student.score);
    li.textContent = `${student.name.padEnd(16, " ")} | Score: ${String(student.score).padStart(3, " ")} | Grade: ${grade}`;
    studentList.appendChild(li);
  }

  const scoresOnly = students.map((s) => s.score);
  const avg = average(scoresOnly).toFixed(1);
  summaryBox.textContent = `Total Students: ${students.length} | Class Average: ${avg}`;
}

function handleAdd() {
  const name = nameInput.value.trim();
  const rawScore = scoreInput.value.trim();
  const score = Number(rawScore);

  errorBox.textContent = "";

  if (name === "") {
    errorBox.textContent = "Error: Student name cannot be empty.";
    return;
  }

  if (rawScore === "") {
    errorBox.textContent = "Error: Please enter a score.";
    return;
  }

  if (!isValidScore(score)) {
    errorBox.textContent = "Error: Score must be a valid number between 0 and 100.";
    return;
  }

  students.push({ name, score });
  console.log("Updated students array:", students);

  nameInput.value = "";
  scoreInput.value = "";
  nameInput.focus();

  render();
}

function handleClear() {
  students.length = 0;
  errorBox.textContent = "";
  console.log("Students cleared:", students);
  render();
}

addBtn.addEventListener("click", handleAdd);
clearBtn.addEventListener("click", handleClear);

scoreInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAdd();
});