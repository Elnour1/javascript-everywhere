let scoreHistory = [];
const scoreInput = document.getElementById("score-input");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const errorMsg = document.getElementById("error-msg");
const currentGrade = document.getElementById("current-grade");
const scoreList = document.getElementById("score-list");

function calculateGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function renderHistoryList() {
  scoreList.innerHTML = "";

  for (const item of scoreHistory) {
    const li = document.createElement("li");
    li.textContent = `Score: ${item.score} → Grade: ${item.grade}`;
    scoreList.appendChild(li);
  }
}

checkBtn.addEventListener("click", () => {
  const rawValue = scoreInput.value.trim();

  if (rawValue === "") {
    errorMsg.textContent = "Please enter a number between 0 and 100";
    currentGrade.textContent = "";
    return;
  }

  const score = Number(rawValue);

  if (Number.isNaN(score) || score < 0 || score > 100) {
    errorMsg.textContent = "Please enter a number between 0 and 100";
    currentGrade.textContent = "";
    return;
  }

  errorMsg.textContent = "";

  const grade = calculateGrade(score);
  currentGrade.textContent = `Result: Grade ${grade} for score ${score}`;

  scoreHistory.push({ score, grade });

  renderHistoryList();

  console.log("Full Score History:", scoreHistory);

  scoreInput.value = "";
  scoreInput.focus();
});

clearBtn.addEventListener("click", () => {
  scoreHistory = [];
  scoreList.innerHTML = "";
  errorMsg.textContent = "";
  currentGrade.textContent = "";
  scoreInput.value = "";
  console.log("History cleared. Current array:", scoreHistory);
});