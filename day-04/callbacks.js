// ==========================================
// 5.4 Sync vs Async Callbacks
// ==========================================
console.log("=== 5.4 Sync vs Async Callbacks ===");

// Synchronous callback
function repeat(times, callback) {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
}
repeat(2, (i) => console.log(`Sync iteration ${i}`));
console.log("Sync 'done' prints strictly AFTER all callbacks finish.\n");

// Asynchronous callback
function repeatLater(times, callback) {
  for (let i = 0; i < times; i++) {
    setTimeout(() => callback(i), 0);
  }
}
repeatLater(2, (i) => console.log(`Async iteration ${i}`));
console.log("Async 'done' prints strictly BEFORE any callback fires.\n");

// How to tell them apart without running:
// If the function wraps callback execution in Web/Node APIs (like setTimeout, fetch, fs.readFile),
// it is asynchronous; if it invokes the callback directly on the current call stack, it is synchronous.

// ==========================================
// 5.5 You cannot return from the future
// ==========================================
setTimeout(() => {
  console.log("\n=== 5.5 Cannot Return from the Future ===");

  function getScoreLaterBroken() {
    setTimeout(() => {
      return 95; // Returns to setTimeout internals, NOT to getScoreLaterBroken
    }, 50);
  }
  console.log("Broken return result:", getScoreLaterBroken()); // undefined

  // Fixed via callback pattern:
  function getScoreLater(callback) {
    setTimeout(() => {
      const score = 95;
      callback(score);
    }, 50);
  }

  getScoreLater((score) => {
    const grade = score >= 90 ? "A" : "B";
    console.log(`Computed from async callback: Score ${score} -> Grade ${grade}`);
  });
}, 200);

// ==========================================
// 5.6 Error-first callbacks
// ==========================================
setTimeout(() => {
  console.log("\n=== 5.6 Error-First Callbacks ===");

  const db = [
    { id: 1, name: "Sara", score: 92 },
    { id: 2, name: "Ali", score: 78 }
  ];

  function findStudent(id, callback) {
    setTimeout(() => {
      const student = db.find((s) => s.id === id);
      if (!student) {
        return callback(new Error(`Student with id ${id} not found.`));
      }
      return callback(null, student);
    }, 50);
  }

  // Good ID (destructuring in callback parameter)
  findStudent(1, (err, student) => {
    if (err) return console.error("Error:", err.message);
    const { name, score } = student;
    console.log(`Success path: Found ${name} with score ${score}`);
  });

  // Bad ID
  findStudent(99, (err, student) => {
    if (err) return console.log(`Handled path: ${err.message}`);
    console.log("Found:", student);
  });
  // Why 'return callback()' matters:
  // Omitting 'return' allows function execution to fall through, potentially firing
  // the callback twice and corrupting downstream state.
}, 500);

// ==========================================
// 5.7 Try/Catch Can't Save You
// ==========================================
setTimeout(() => {
  console.log("\n=== 5.7 Try/Catch and Timers ===");

  // The crash demonstration:
  // try {
  //   setTimeout(() => {
  //     throw new Error("Fatal async timer failure");
  //   }, 50);
  // } catch (err) {
  //   console.log("This catch block NEVER triggers for async tasks!");
  // }

  // Why catch never ran:
  // The synchronous try/catch block entered and exited on the call stack long before
  // the timer expired; when the callback finally threw, it executed in a completely new call stack context.

  // Safe error handling via callback:
  function safeAsyncOperation(shouldFail, callback) {
    setTimeout(() => {
      if (shouldFail) {
        return callback(new Error("Safely handled async error"));
      }
      return callback(null, "Operation succeeded");
    }, 50);
  }

  safeAsyncOperation(true, (err, result) => {
    if (err) {
      console.log(`Caught gracefully via callback: ${err.message}`);
    } else {
      console.log(result);
    }
  });
}, 800);