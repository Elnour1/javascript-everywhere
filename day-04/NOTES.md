# Day 04 Notes — Advanced JavaScript & Asynchronous Flow

---

## Part 1: Destructuring, Immutability & Modern Data Handling

### What destructuring does & Object vs Array matching
* **Destructuring** unpacks properties from objects or items from arrays into distinct local variables in a single declarative step.
* **Objects match by property key name** regardless of ordering: `{ score, name }` extracts properties matching those identifiers.
* **Arrays match strictly by positional index**: `[first, second]` maps directly to index 0 and 1, requiring skip commas (`[ , , third]`) to reach later positions.

### What `const { a: b } = obj` creates
* It declares and creates a new local variable named **`b`** bound to the value of property `a`.
* It does **NOT** declare or create a variable named `a`. Referencing `a` afterwards throws a `ReferenceError`.

### When a destructuring default fires & What doesn't trigger it
* Defaults evaluate and fire **strictly when the value evaluates to `undefined`** (or is completely missing).
* **Three values that do NOT trigger defaults:**
  1. `null` (represents intentional empty object value).
  2. `0` (a valid numeric scalar).
  3. `false` (a valid boolean primitive).

### Why `const { x } = undefined` throws, and the fix
* Primitive `undefined` cannot be converted into an object representation. JavaScript throws `TypeError: Cannot destructure property 'x' of undefined as it is undefined`.
* **The Fix:** Defensive default assignment:
  ```javascript
  const { x } = maybeUndefined ?? {};
  // or in function parameter signatures:
  function fn({ x } = {}) {}