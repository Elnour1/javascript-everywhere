# Predictions & Actual Results

| # | Prediction | Actual Result | Status | Explanation / Mechanism |
|---|------------|---------------|--------|--------------------------|
| 1 | `undefined` | `undefined` | Correct | - |
| 2 | `2` | `ReferenceError` | Incorrect | **Mechanism:** Temporal Dead Zone (TDZ) - `let` is hoisted but uninitialized. |
| 3 | `[1, 2, 3]` | `[1, 2]` | Incorrect | **Mechanism:** Pass-by-value vs Reference mutation. |
...