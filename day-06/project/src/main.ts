import type { GradedStudent, Student, LetterGrade } from "./types.ts";
import {
  isStudent,
  letterGrade,
  calculateAverage,
  getAttendance,
  errorMessage,
} from "./lib/index.ts";

// ==========================================
// 11.1 — Typed DOM Helper
// ==========================================

function $<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`DOM Element not found for selector: "${selector}". Check your index.html markup!`);
  }
  return element;
}

// Strictly typed element lookups:
const loadButton = $<HTMLButtonElement>("#load-btn");
const addForm = $<HTMLFormElement>("#add-form");
const nameInput = $<HTMLInputElement>("#student-name");
const scoreInput = $<HTMLInputElement>("#student-score");
const statusBox = $<HTMLDivElement>("#status-box");
const tableBody = $<HTMLTableSectionElement>("#student-table-body");
const summaryBox = $<HTMLDivElement>("#summary-box");

// ==========================================
// 11.2 — Discriminated Union Page State
// ==========================================

type PageState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "loaded"; count: number; skipped: number }
  | { status: "failed"; error: string };

let currentState: PageState = { status: "idle" };
let students: GradedStudent[] = [];

// Exhaustive rendering switch
function renderState(state: PageState): void {
  currentState = state;
  statusBox.className = `status ${state.status}`;

  switch (state.status) {
    case "idle":
      statusBox.textContent = "Ready to load students.";
      break;
    case "loading":
      statusBox.textContent = state.message;
      break;
    case "loaded":
      statusBox.textContent = `Loaded ${state.count} students successfully. Skipped ${state.skipped} broken records.`;
      break;
    case "failed":
      statusBox.textContent = `Failed: ${state.error}`;
      break;
    default: {
      const _unreachable: never = state;
      throw new Error(`Unhandled state: ${_unreachable}`);
    }
  }
}

function renderTable(): void {
  tableBody.innerHTML = "";

  for (const s of students) {
    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.textContent = String(s.id);

    const nameTd = document.createElement("td");
    nameTd.textContent = s.name;

    const scoreTd = document.createElement("td");
    scoreTd.textContent = String(s.score);

    const gradeTd = document.createElement("td");
    gradeTd.textContent = s.grade;

    const attTd = document.createElement("td");
    attTd.textContent = s.attendance !== null ? `${s.attendance}%` : "—";

    tr.append(idTd, nameTd, scoreTd, gradeTd, attTd);
    tableBody.appendChild(tr);
  }

  if (students.length > 0) {
    summaryBox.style.display = "block";
    const scores = students.map((s) => s.score);
    const avg = calculateAverage(scores);
    const overallGrade: LetterGrade = letterGrade(avg);
    summaryBox.textContent = `Class Average: ${avg} | Overall Letter Grade: ${overallGrade} | Total Students: ${students.length}`;
  } else {
    summaryBox.style.display = "none";
  }
}

// ==========================================
// Event Handlers with Typed Signatures
// ==========================================

const handleLoadStudents = async (): Promise<void> => {
  loadButton.disabled = true;
  renderState({ status: "loading", message: "Fetching students and calculating attendance..." });

  try {
    const response = await fetch("./students.json");
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const rawData: unknown = await response.json();
    if (!Array.isArray(rawData)) {
      throw new Error("Payload is not an array of students");
    }

    const validRaw: Student[] = [];
    let skipped = 0;

    for (const item of rawData) {
      if (isStudent(item)) {
        validRaw.push(item);
      } else {
        skipped++;
      }
    }

    // Parallel attendance fetching
    const attendancePromises = validRaw.map((s) => getAttendance(s.id));
    const settledAttendance = await Promise.allSettled(attendancePromises);

    students = validRaw.map((s, idx) => {
      const attResult = settledAttendance[idx];
      const attendance = attResult && attResult.status === "fulfilled" ? attResult.value : null;

      return {
        ...s,
        grade: letterGrade(s.score),
        passed: s.score >= 60,
        attendance,
      };
    });

    renderTable();
    renderState({ status: "loaded", count: students.length, skipped });
  } catch (err) {
    renderState({ status: "failed", error: errorMessage(err) });
  } finally {
    // Button re-enabled only in finally
    loadButton.disabled = false;
  }
};

const handleAddStudent = (event: SubmitEvent): void => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const score = scoreInput.valueAsNumber;

  if (name.length === 0) {
    alert("Please enter a valid student name.");
    return;
  }

  if (Number.isNaN(score) || score < 0 || score > 100) {
    alert("Please enter a valid numeric score between 0 and 100.");
    return;
  }

  const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

  const newStudent: GradedStudent = {
    id: nextId,
    name,
    score,
    grade: letterGrade(score),
    passed: score >= 60,
    attendance: null, // New student starts with no attendance recorded
  };

  students.push(newStudent);
  renderTable();

  nameInput.value = "";
  scoreInput.value = "";
};

loadButton.addEventListener("click", () => {
  void handleLoadStudents();
});

addForm.addEventListener("submit", (e) => {
  handleAddStudent(e as SubmitEvent);
});

// Initial render
renderState({ status: "idle" });