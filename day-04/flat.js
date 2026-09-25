/**
 * flat.js — Flattening the pyramid using named functions & immutable state
 */

const { findStudent, findCourse, findTeacher, findRoom } = require("./fake-db");

console.log("=== Running Flat Asynchronous Pipeline ===");

function buildReport(studentId, done) {
  // Step 1: Student Lookup
  findStudent(studentId, (err, student) => {
    if (err) return done(err);
    handleCourseStep({ student }, done);
  });
}

// Step 2: Course Lookup (Flat named handler)
function handleCourseStep(state, done) {
  findCourse(state.student.courseId, (err, course) => {
    if (err) return done(err);
    const updatedState = { ...state, course }; // Immutable state build with spread
    handleTeacherStep(updatedState, done);
  });
}

// Step 3: Teacher Lookup
function handleTeacherStep(state, done) {
  findTeacher(state.course.teacherId, (err, teacher) => {
    if (err) return done(err);
    const updatedState = { ...state, teacher };
    handleRoomStep(updatedState, done);
  });
}

// Step 4: Room Lookup & Final Report Generation
function handleRoomStep(state, done) {
  findRoom(state.teacher.roomId, (err, room) => {
    if (err) return done(err);
    const finalState = { ...state, room };
    
    const { student, course, teacher } = finalState;
    const report = `${student.name} is enrolled in "${course.title}", taught by ${teacher.name} in ${room.hall} (Floor ${room.floor}).`;
    
    return done(null, report);
  });
}

// ==========================================
// Concurrent Invocations: Good ID and Bad ID
// ==========================================

console.log("Calling good ID (1) and bad ID (99) concurrently:\n");

// Call with Bad ID
buildReport(99, (err, report) => {
  if (err) {
    console.log(`[Handled Bad ID]: ${err.message}`);
  } else {
    console.log(`[Report]: ${report}`);
  }
});

// Call with Good ID
buildReport(1, (err, report) => {
  if (err) {
    console.log(`[Handled Good ID]: ${err.message}`);
  } else {
    console.log(`[Report]: ${report}`);
  }
});

// Finishing Order Explanation:
// The Bad ID (99) fails and finishes FIRST at Step 1 (~100ms) because the student does not exist.
// The Good ID (1) finishes LATER (~450ms) because it sequentially traverses all 4 asynchronous lookups.

// ==========================================
// 6.4 Defend yourself: once(fn) helper
// ==========================================
console.log("\n=== Testing once(fn) Protection ===");

function once(fn) {
  let hasRun = false;
  let cachedResult;

  return function (...args) {
    if (!hasRun) {
      hasRun = true;
      cachedResult = fn(...args);
      return cachedResult;
    }
    // Silently ignores subsequent invocations or returns cached result
    return cachedResult;
  };
}

// Simulated faulty asynchronous function that accidentally calls back twice
function buggyOperation(callback) {
  callback("First invocation (Valid)");
  callback("Second invocation (Buggy duplicate!)");
}

// Wrap the callback using once
const safeCallback = once((message) => {
  console.log(`[safeCallback executed]: ${message}`);
});

buggyOperation(safeCallback);
// Notice: Only "First invocation (Valid)" is logged. The second call was blocked!