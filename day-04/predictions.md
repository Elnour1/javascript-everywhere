# Predictions vs Actual Results — Day 04

| Snippet | Predicted Output | Actual Output | Status |
|---|---|---|---|
| 1 | `1 "undefined"` | `1 "undefined"` | Match |
| 2 | `ReferenceError: x is not defined` | `ReferenceError: x is not defined` | Match |
| 3 | `5` | `5` | Match |
| 4 | `null` | `null` | Match |
| 5 | `c` | `c` | Match |
| 6 | `3` | `3` | Match |
| 7 | `99` | `99` | Match |
| 8 | `{ b: 2, a: 1 }` | `{ b: 2, a: 1 }` | Match |
| 9 | `undefined 7` | `undefined 7` | Match |
| 10 | `TypeError` | `TypeError: Cannot destructure property 'a' of 'undefined' as it is undefined` | Match |
| 11 | `TypeError` | `TypeError: Cannot read properties of undefined (reading 'city')` | Match |
| 12 | `"fallback" 0` | `"fallback" 0` | Match |
| 13 | `a -> c -> b` | `a -> c -> b` | Match |
| 14 | `sync -> micro -> timeout` | `sync -> micro -> timeout` | Match |
| 15 | `3, 3, 3` | `3, 3, 3` | Match |
| 16 | `undefined` | `undefined` | Match |
| 17 | `loop finished -> timer` | `loop finished -> timer` | Match |
| 18 | `outer -> first -> second -> nested` | `outer -> first -> second -> nested` | Match |
| 19 | `timer -> micro inside timer -> timer 2` | `timer -> micro inside timer -> timer 2` | Match |
| 20 | `after try` (then uncaught crash) | `after try` (then uncaught error) | Match |
| 21 | `sync call -> after load -> async call` | `sync call -> after load -> async call` | Match |
| 22 | `D -> C -> B -> A` | `D -> C -> B -> A` | Match |

---

### Explicit Mechanism Explanations (The 8 Real-Bug Culprits)

* **#4: Default Value Trigger Mechanism (Null vs Undefined)**
  Default values in destructuring are triggered strictly when the retrieved property evaluates to `undefined`. `null` is a valid, intentional object-absence primitive; therefore, the default is skipped and `null` remains assigned.

* **#7: Shallow Copy Reference Mutation**
  The object spread operator (`...`) creates a shallow copy, duplicating only top-level primitives. Nested objects retain their original memory reference pointers, so modifying `shallow.nested.v` mutates the underlying heap object shared by `obj`.

* **#8: Key Precedence in Object Spread**
  When spreading multiple objects into a new literal, duplicate keys are evaluated left-to-right. Properties declared later in the sequence overwrite earlier matching keys (`b: 2` overrides `b: 3`).

* **#10: Destructuring Undefined Without Fallback**
  When calling `g()` without arguments, the parameter defaults to `undefined`. Destructuring an object pattern (`{ a }`) on `undefined` causes JavaScript to attempt object coercion on non-coercible primitives, throwing a terminal `TypeError`.

* **#15: Var Loop Binding & Event Loop Macrotask Queue**
  `var` possesses function scope rather than block scope, allocating a single shared memory cell for `i`. The `setTimeout` callbacks are queued as macrotasks and execute only after the synchronous call stack empties and the loop completes with `i = 3`.

* **#18: Nested Macrotask Queue Registration Order**
  Macrotasks run in FIFO (First-In, First-Out) order per timer queue phase. The callbacks for `outer`, `first`, and `second` were already registered in the queue before `nested` was scheduled, so `second` runs prior to `nested`.

* **#19: Microtask Checkpoint Priority After Macrotasks**
  At the conclusion of each individual macrotask callback, the Event Loop unconditionally drains the entire Microtask Queue before picking up the next waiting macrotask. Hence, `micro inside timer` runs before `timer 2`.

* **#21: Mixed Synchronous & Asynchronous Callback Execution (Zalgo Pattern)**
  Invoking callbacks synchronously on the current call stack before scheduling asynchronous operations leads to unpredictable order-of-execution bugs (known as "releasing Zalgo"). `after load` logs before the timer callback fires.