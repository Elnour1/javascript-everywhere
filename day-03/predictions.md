# Predictions vs Actual Results — Scope & Hoisting

| Snippet | Predicted Output | Actual Output | Status |
|---|---|---|---|
| 1 | `undefined` | `undefined` | Match |
| 2 | `ReferenceError` | `ReferenceError: Cannot access 'b' before initialization` | Match |
| 3 | `hi` | `hi` | Match |
| 4 | `ReferenceError` | `ReferenceError: Cannot access 'bye' before initialization` | Match |
| 5 | `undefined` | `undefined` | Match |
| 6 | `undefined` | `undefined` | Match |
| 7 | `undefined` | `undefined` | Match |
| 8 | `NaN` | `NaN` | Match |
| 9 | `null 10 0` | `null 10 0` | Match |
| 10 | `inner outer` | `inner outer` | Match |
| 11 | `3` | `3` | Match |
| 12 | `ReferenceError` | `ReferenceError: j is not defined` | Match |
| 13 | `1 2 1` | `1 2 1` | Match |
| 14 | `[ 2, 4, 6 ]` | `[ 2, 4, 6 ]` | Match |
| 15 | `[Function: r]` | `[Function: r]` | Match |

---

### TDZ Explicit Mechanism Explanations (#2 and #4)

* **Snippet 2 Mechanism:**
  Variable `b` is hoisted to the start of its enclosing block, but it sits in the **Temporal Dead Zone (TDZ)** where reading or writing to it is strictly forbidden until the line `let b = 2;` evaluates at runtime.

* **Snippet 4 Mechanism:**
  The identifier `bye` is hoisted into its lexical scope, but because it is declared with `const`, it remains in the **Temporal Dead Zone (TDZ)** until its assignment statement executes, throwing a `ReferenceError` when called early.

---

### Why JavaScript Behaved That Way (Common Gotchas)

* **Snippet 5:** The trailing semicolon immediately following `return;` terminates the execution flow and returns `undefined`, rendering `42;` unreachable dead code.
* **Snippet 6:** Curly braces `{}` define a block statement rather than an implicit return body; without an explicit `return`, the function returns `undefined`.
* **Snippet 7:** The JS engine parses `{ value: x }` as a block body with a labeled statement (`value:`) instead of an object literal; returning an object directly requires wrapping parentheses `({ value: x })`.
* **Snippet 8:** Omitted parameters default to `undefined`, and evaluating `1 + undefined` coerces to `NaN`.
* **Snippet 9:** Default parameter assignments trigger strictly on `undefined`; `null` and `0` are valid arguments and do not activate the default.
* **Snippet 11:** `var` does not respect block boundaries, so `i` leaks outside the loop and retains its post-increment value `3`.
* **Snippet 12:** `let` is strictly block-scoped to the `for` loop body, making `j` completely invisible outside.
* **Snippet 13:** `q` maintains a persistent lexical closure over its own `c` variable, while `counter()()` creates an entirely new closure scope with `c` reset to `0`.