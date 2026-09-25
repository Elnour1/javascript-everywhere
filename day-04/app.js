// ==========================================
// SECTION 1: Pure Logic (Runtime-Agnostic)
// Destructured parameters, templates, no DOM
// ==========================================

function isValidScore(score) {
  return typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;
}

function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// Destructured parameter with default city fallback & template literal
function describe({ name, score, city = "Unknown" }) {
  return `${name} (${city}) — Score: ${score}`;
}

// Simulated remote server fetch (fails ~25% of the time, takes 1200ms)
function fetchStudents(callback) {
  setTimeout(() => {
    const fails = Math.random() < 0.25;
    if (fails) {
      return callback(new Error("Network Error: Failed to fetch students from remote server."));
    }

    const mockServerData = [
      { name: "Nouran Ezz", score: 89, city: "Alexandria" },
      { name: "Khaled Saqly", score: 94, city: "Cairo" },
      { name: "Salma Taha", score: 77 } // Notice: No city property
    ];
    return callback(null, mockServerData);
  }, 1200);
}

// ==========================================
// SECTION 2: DOM & State Handling
// Event Listeners, Non-mutating state, Event loop
// ==========================================

let students = [];

// DOM References
const nameInput = document.getElementById("nameInput");
const scoreInput = document.getElementById("scoreInput");
const cityInput = document.getElementById("cityInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const loadBtn = document.getElementById("loadBtn");
const freezeBtn = document.getElementById("freezeBtn");
const chunkBtn = document.getElementById("chunkBtn");
const statusBox = document.getElementById("statusBox");
const studentList = document.getElementById("studentList");
const summaryBox = document.getElementById("summaryBox");

function render() {
  studentList.innerHTML = "";

  for (const s of students) {
    const li = document.createElement("li");
    li.textContent = describe(s);
    studentList.appendChild(li);
  }

  const scoresOnly = students.map((s) => s.score);
  const avg = average(scoresOnly).toFixed(1);
  summaryBox.textContent = `Total Students: ${students.length} | Class Average: ${avg}`;
}

function showStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.className = `status-box ${isError ? "status-error" : "status-info"}`;
}

// 8.1 Add Handler with Guard Clauses and Immutability
function handleAdd() {
  const name = nameInput.value.trim();
  const rawScore = scoreInput.value.trim();
  const rawCity = cityInput.value.trim();
  const score = Number(rawScore);

  showStatus("");

  // Guard Clauses
  if (name === "") {
    showStatus("Error: Name cannot be empty.", true);
    return;
  }
  if (rawScore === "") {
    showStatus("Error: Score cannot be empty.", true);
    return;
  }
  if (!isValidScore(score)) {
    showStatus("Error: Score must be a valid number between 0 and 100.", true);
    return;
  }

  // Construct object: Blank city adds NO key at all
  const newStudent = {
    name,
    score,
    ...(rawCity !== "" && { city: rawCity })
  };

  // Replace array via spread — NO .push
  students = [...students, newStudent];
  console.log("Updated students array (immutability):", students);

  nameInput.value = "";
  scoreInput.value = "";
  cityInput.value = "";
  nameInput.focus();

  render();
}

function handleClear() {
  students = [];
  showStatus("");
  console.log("Students cleared.");
  render();
}

// 8.2 Load from Server with Error-first callback
function handleLoad() {
  loadBtn.disabled = true;
  showStatus("Loading students from server...");

  fetchStudents((err, incomingStudents) => {
    loadBtn.disabled = false;

    if (err) {
      showStatus(err.message, true);
      console.error("[Server Fetch Error]:", err.message);
      return;
    }

    // Merge loaded with existing students via spread
    students = [...students, ...incomingStudents];
    showStatus(`Successfully loaded ${incomingStudents.length} students!`);
    console.log("Merged students from server:", students);
    render();
  });

  // Logs immediately, proving the synchronous UI flow did not block
  console.log("Fetch request initiated asynchronously; page execution carries on immediately.");
}

// 8.3 Freeze vs Chunked Demo
function handleFreeze() {
  showStatus("Freezing main thread synchronously for 3 seconds...");
  
  // Synchronous busy-wait loop blocking the Event Loop
  setTimeout(() => {
    const start = Date.now();
    while (Date.now() - start < 3000) {}
    showStatus("Thread unblocked! Notice that typing was impossible during the freeze.");
  }, 50);
}

function handleChunked() {
  let progress = 0;
  const totalSteps = 60;
  showStatus("Processing 60 work slices without freezing UI (Try typing in the inputs!)...");

  function step() {
    if (progress < totalSteps) {
      // Simulate heavy computational work per slice
      const start = Date.now();
      while (Date.now() - start < 50) {}

      progress++;
      showStatus(`Chunked progress: ${Math.round((progress / totalSteps) * 100)}% (UI stays responsive)`);

      // Yield control back to the browser event loop before running next slice
      setTimeout(step, 0);
    } else {
      showStatus("Chunked work completed smoothly without thread starvation!");
    }
  }

  step();
}

// Wiring Handlers (Passing function references without calling them)
addBtn.addEventListener("click", handleAdd);
clearBtn.addEventListener("click", handleClear);
loadBtn.addEventListener("click", handleLoad);
freezeBtn.addEventListener("click", handleFreeze);
chunkBtn.addEventListener("click", handleChunked);