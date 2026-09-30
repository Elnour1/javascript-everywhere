// Importing directly from the SAME modules used by Node.js
import { letterGrade, average, isValidStudent } from './lib/grade-lib.js';
import getAttendance from './lib/db.js';
import { withTimeout, delay } from './lib/async-utils.js';

// Top-level module variable (scoped strictly to this module - invisible on window)
let students = [];
const PASS_MARK = 60;

// DOM Elements
const loadBtn = document.getElementById('load-btn');
const timeBtn = document.getElementById('time-btn');
const slowCheckbox = document.getElementById('simulate-slow');
const statusDiv = document.getElementById('status');
const summaryDiv = document.getElementById('summary');
const studentsTable = document.getElementById('students-table');
const tableBody = document.getElementById('table-body');
const addForm = document.getElementById('add-form');
const nameInput = document.getElementById('student-name');
const scoreInput = document.getElementById('student-score');

// Render Table
function render() {
  if (students.length === 0) {
    studentsTable.style.display = 'none';
    summaryDiv.textContent = '';
    return;
  }

  studentsTable.style.display = 'table';
  tableBody.innerHTML = students.map((s) => {
    const grade = letterGrade(s.score);
    const passStatus = s.score >= PASS_MARK ? 'PASS' : 'FAIL';
    const statusColor = passStatus === 'PASS' ? 'green' : 'red';
    return `
      <tr>
        <td>${s.id}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.score}</td>
        <td><strong>${grade}</strong></td>
        <td style="color: ${statusColor}; font-weight: bold;">${passStatus}</td>
        <td>${s.attendance ?? '—'}</td>
      </tr>
    `;
  }).join('');

  const scores = students.map((s) => s.score);
  const avg = average(scores);
  summaryDiv.textContent = `Class Average: ${avg} | Total Students: ${students.length}`;
}

// 8.2: Load Students Handler with Async/Await & Timeout
async function handleLoadStudents() {
  loadBtn.disabled = true;
  loadBtn.textContent = 'Loading…';
  statusDiv.className = 'status-box';
  statusDiv.textContent = 'Fetching student data...';

  try {
    const fetchPromise = (async () => {
      // Simulate artificial delay if checked to exceed the 2000ms threshold
      if (slowCheckbox.checked) {
        console.warn('[Network Simulation] Introducing 2500ms delay...');
        await delay(2500);
      }
      const res = await fetch('./students.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    })();

    // Wrapped in withTimeout(..., 2000)
    const rawData = await withTimeout(fetchPromise, 2000);

    // Validate students
    const validData = rawData.filter(isValidStudent);

    // Fetch attendance concurrently using Promise.allSettled
    statusDiv.textContent = 'Fetching attendance in parallel...';
    const attendanceResults = await Promise.allSettled(
      validData.map((s) => getAttendance(s.id))
    );

    let failedAttendanceCount = 0;
    students = validData.map((student, idx) => {
      const outcome = attendanceResults[idx];
      let attendance = '—';
      if (outcome.status === 'fulfilled') {
        attendance = outcome.value;
      } else {
        failedAttendanceCount++;
      }
      return { ...student, attendance };
    });

    render();

    // Report status
    if (failedAttendanceCount > 0) {
      statusDiv.className = 'status-box info';
      statusDiv.textContent = `Loaded ${students.length} students (${failedAttendanceCount} attendance lookup(s) failed and displayed as —).`;
    } else {
      statusDiv.className = 'status-box info';
      statusDiv.textContent = `Successfully loaded ${students.length} students.`;
    }
  } catch (err) {
    console.error('Load failed:', err);
    statusDiv.className = 'status-box error';
    statusDiv.textContent = `Error: ${err.message}`;
  } finally {
    // Re-enabled in ONE place only
    loadBtn.disabled = false;
    loadBtn.textContent = 'Load students';
  }
}

// 8.2: Time Both Button (Sequential vs Parallel Timings)
async function handleTimeBoth() {
  if (students.length === 0) {
    alert('Please load students first!');
    return;
  }

  timeBtn.disabled = true;
  console.log('--- Timing Sequential vs Parallel Attendance Fetch ---');

  // Sequential
  const startSeq = performance.now();
  for (const s of students) {
    try { await getAttendance(s.id); } catch (_) {}
  }
  const endSeq = (performance.now() - startSeq).toFixed(1);

  // Parallel
  const startPar = performance.now();
  await Promise.allSettled(students.map((s) => getAttendance(s.id)));
  const endPar = (performance.now() - startPar).toFixed(1);

  console.log(`[Browser Timing] Sequential: ${endSeq}ms | Parallel: ${endPar}ms`);
  alert(`Sequential: ${endSeq}ms\nParallel: ${endPar}ms\n(Check DevTools console for details)`);
  timeBtn.disabled = false;
}

// 8.2: Add Student Form (Immutable state update)
function handleAddStudent(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);

  if (!name || isNaN(score)) return;

  const newStudent = {
    id: Date.now(),
    name,
    score,
    attendance: '—'
  };

  // Immutable addition: students = [...students, newStudent]
  students = [...students, newStudent];
  render();

  nameInput.value = '';
  scoreInput.value = '';
}

// Event Listeners (No onclick in HTML)
loadBtn.addEventListener('click', handleLoadStudents);
timeBtn.addEventListener('click', handleTimeBoth);
addForm.addEventListener('submit', handleAddStudent);