# Day 05: Asynchronous JavaScript, Modules, and Professional Git

---

## Parts 1–2: Promises & Async/Await

### 1. What a Promise is, its three states, and the "settles once" guarantee
- A **Promise** is a native JavaScript object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a trusted receipt for future data.
- **Three States:**
  1. `pending`: Initial state, operation is still ongoing.
  2. `fulfilled`: Operation completed successfully, yielding a resolved value.
  3. `rejected`: Operation failed, carrying a rejection reason (usually an `Error` object).
- **The "Settles Once" fix for Day 04:** In callback patterns, a buggy third-party function could call your callback multiple times or call both error and success callbacks. A Promise can transition from `pending` to either `fulfilled` or `rejected` **exactly once**. Any subsequent calls to `resolve()` or `reject()` are silently ignored, preventing duplicate execution bugs.

### 2. The Missing-Return Bug
- **What it looks like:**
  ```javascript
  doSomething()
    .then((result) => {
      delayValue(100, result * 2); // BUG: missing `return`
    })
    .then((next) => {
      console.log(next); // undefined
    });