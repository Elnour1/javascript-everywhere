# Day 04 vs Day 05 Comparison

### 1. Line Count Comparison
- **Day 04 report.js (Monolithic / Callbacks):** ~115 lines (all helper functions, callback nesting, manual file read, error checks in one file).
- **Day 05 report.js:** ~65 lines (only orchestrates business logic).
- **Day 05 lib/ modules:** ~100 lines (separated into modular, reusable, single-responsibility units).

### 2. Copies of `letterGrade` across Days
- **Days 03 & 04:** 3 copies (duplicated across exercises, tests, and reports due to lack of standard modular exports).
- **Day 05:** Exactly **1 copy** in `lib/grade-lib.js`, re-exported through `lib/index.js`.

### 3. What got shorter, and what got clearer?
- **What got shorter:** The reporting script itself (`report.js`) became drastically shorter and cleaner because asynchronous control flow (`Promise.allSettled`, `async/await`) eliminated repetitive nested callback error-checking logic.
- **What got clearer:** Separation of concerns became immediately obvious; all math/grading logic resides in `grade-lib.js`, network/latency simulation is isolated in `db.js`, resilience utilities are encapsulated in `async-utils.js`, leaving `report.js` purely focused on data presentation.
