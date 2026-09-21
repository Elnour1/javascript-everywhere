# Day 03 — Technical Notes: Scope, Hoisting & Functions

## Core Concepts

### 1. Parameter vs Argument
* **Parameter:** The placeholder variable defined in the function signature (e.g., `a` and `b` in `function add(a, b)`).
* **Argument:** The actual concrete value passed into the function upon invocation (e.g., `5` and `10` in `add(5, 10)`).

### 2. Declaration vs Expression vs Arrow
* **Function Declaration:** Fully hoisted with body; pick when writing top-level modular utility functions that need file-wide availability.
* **Function Expression:** Assigned to a variable and evaluates at runtime; pick when passing functions dynamically or assigning them conditionally.
* **Arrow Function:** Lexically binds `this` with concise syntax and optional implicit return; pick for short callbacks (`map`, `filter`) and functional transforms.

### 3. Return vs Console.log
`console.log` is a side-effect tool meant for human inspection in the console, yielding `undefined` to the program. `return` hands a concrete value back to the execution context so other parts of the application can store, transform, or calculate with it.

### 4. Guard Clauses
A guard clause is an early return condition placed at the very top of a function to validate inputs and bail out on edge cases immediately. It eliminates deeply nested `if/else` ladders, flattens code indentation, and keeps the "happy path" clean at the root level.

### 5. Scope: Global vs Function vs Block
* **Global Scope:** Variables defined outside any construct, accessible from anywhere across the entire runtime environment.
* **Function Scope:** Variables created within a function body (via `var`, `let`, or `const`), contained strictly within that function.
* **Block Scope:** Variables declared via `let` and `const` inside curly braces `{}` (such as `if`, `for`, or bare blocks), completely invisible outside those braces.

### 6. The Scope Chain
The scope chain is the hierarchical lookup resolution mechanism that JavaScript uses to find variable values. It is strictly **one-way: from the innermost current scope outward toward the global scope**, never inward.

### 7. What Hoisting Actually Moves
* **`function`:** Hoists both the function name and its complete body implementation to the top of its scope.
* **`var`:** Hoists only the variable declaration initialized to `undefined`; assignment stays at the runtime line.
* **`let` / `const`:** Hoisted into the scope block but not initialized; they reside in the Temporal Dead Zone (TDZ).

### 8. Temporal Dead Zone (TDZ)
The TDZ is the temporal gap between the start of a lexical scope and the line where a `let` or `const` is evaluated. An explicit `ReferenceError` here beats `undefined` because it fails loudly at point of failure instead of allowing corrupted state to flow silently through your program.

### 9. A Closure in One Sentence
A function that retains ongoing access to the variables of its parent scope even after the outer function has finished executing.

### 10. Passing `fn` vs `fn()`
Passing `fn` passes a reference to the function object so it can be called later by the receiver. Passing `fn()` immediately invokes the function at that exact millisecond and hands over whatever that function returns (often `undefined`).

---

## Task 5.3: Prove It's Better

* **Day 02 Line Count:** ~75 lines (imperative, coupled presentation and logic).
* **Day 03 Total Line Count:** ~140 lines (modular architecture, defensive guard clauses, isolated view layer).
* **The One-Place Change:** Modifying the passing grade cutoff (e.g., from `60` to `65`). In Day 02, this required edits in three separate places: the `if/else` letter grade checks, the ternary status column formatting, and the at-risk calculation. In Day 03, changing `passMark = 65` in `isPassing()` inside `grade-lib.js` automatically cascades across the terminal table, summary stats, and browser rendering.

---

## Real Bug Hit Today

* **Exact Error Message:**
  `TypeError: Cannot read properties of undefined (reading 'padEnd')`
* **Context:** Occurred in `report.js` while running the terminal report over `rawStudents`.
* **Root Cause:** A corrupt test record had `name: null`, which caused calling `student.name.padEnd(16, " ")` inside `formatRow` to throw immediately because `null` has no string prototype methods.
* **The Fix:** Added an explicit guard check at the beginning of the `for...of` loop in `report.js`:
  ```javascript
  if (!student.name || !isValidScore(student.score)) {
    skippedCount++;
    continue;
  }