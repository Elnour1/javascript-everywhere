# Predictions & Actuals: Task 1

| Snippet | Predicted tsc | Predicted node | Actual tsc | Actual node | Match? | Mechanism / Reason |
|---|---|---|---|---|---|---|
| p01 | Error (Type string is not assignable to type number) | Prints "92" | TS2322 line 2 | Prints "92" | Yes | Node runs plain JS without type checking |
| p02 | Error (Type string is not assignable to type 'A' \| 'B') | Prints A A | TS2322 line 4 | Prints A A | Yes | **Type Widening** (`let other` widens literal "A" to string) |
| p03 | OK | Prints "23" | OK | Prints "23" | Yes | `as any` disables compile-time safety; string concatenation occurs |
| p04 | Error (Object is possibly undefined) | TypeError: Cannot read properties of undefined | TS18048 line 3 | TypeError | Yes | **noUncheckedIndexedAccess** checks array boundaries |
| p05 | Error (Object is possibly undefined) | TypeError: Cannot read properties of undefined | TS18048 line 2 | TypeError | Yes | `.find()` returns `T \| undefined` |
| p06 | Error ('name' is possibly 'undefined') | TypeError: Cannot read properties of undefined | TS18048 line 1 | TypeError | Yes | Optional parameter can be undefined at runtime |
| p07 | Error (Source has 3 elements, target allows 2) | Prints ['Sara', 92, true] | TS2322 line 1 | Prints ['Sara', 92, true] | Yes | Fixed-length tuple assignment check |
| p08 | Error (Object literal may only specify known properties) | Prints { name: 'Sara', score: 92, age: 20 } | TS2353 line 2 | Prints object | Yes | **Excess Property Checks** on object literals |
| p09 | OK | Prints { name: 'Sara', score: 92, age: 20 } | OK | Prints object | Yes | **Structural Typing**: indirect assignment bypasses excess check |
| p10 | OK | Prints { id: 1, tags: ['ts'] } | OK | Prints object | Yes | **Readonly shallow check**: `readonly` prevents reassignment, not nested array mutation |
| p11 | Error ('raw' is of type 'unknown') | Prints Sara | TS18046 line 2 | Prints Sara | Yes | `unknown` requires narrowing before property access |
| p12 | OK | TypeError: Cannot read properties of undefined | OK | TypeError | Yes | `any` bypasses type checks; typo causes runtime crash |
| p13 | OK | Prints "A" "2.0" | OK | Prints "A" "2.0" | Yes | Control Flow Analysis / Narrowing via `typeof` |
| p14 | OK | Prints 2 "a1" | OK | Prints 2 "a1" | Yes | **Generic Type Parameter Inference** |
| p15 | Error (Argument of type 'number' is not assignable) | TypeError: Cannot read properties of undefined | TS2344 line 3 | TypeError | Yes | Generic constraint `<T extends { length: number }>` |
| p16 | Error (Type Promise<number> not assignable to number) | Prints Promise { 92 } | TS2322 line 2 | Prints Promise | Yes | `async` function returns a `Promise`, not raw value |
| p17 | OK | Prints "92.0" | OK | Prints "92.0" | Yes | Top-level `await` unpacks the Promise |
| p18 | Error ('err' is of type 'unknown') | Prints boom | TS18046 line 2 | Prints boom | Yes | In strict mode, `catch` variable is `unknown` |
| p19 | OK | Prints 92 undefined | OK | Prints 92 undefined | Yes | **Type Assertion (`as Student`)**: silences missing properties |
| p20 | Error / OK | Prints 0 | Error TS5133 | Prints 0 | Yes | **Enums** generate runtime code, rejected by erasable syntax |
| p21 | Error (Property 'name' is missing in type) | Prints { score: 80 } { score: 80 } | TS2741 line 3 | Prints objects | Yes | `Required<Partial<Student>>` demands all original properties |
| p22 | Error (Type '"L"' is not assignable to type 'Size') | Prints M L | TS2322 line 4 | Prints M L | Yes | Union of keys `keyof typeof sizes` only allows "S" \| "M" |
| p23 | OK | Prints object object number bigint | OK | Prints object object number bigint | Yes | **JS Type Quirks**: `typeof null` is "object", `typeof NaN` is "number" |
| p24 | OK | Prints [1, 'two'] | OK | Prints [1, 'two'] | Yes | Implicit `any[]` array widening |
| p25 | Error (Operator '+' cannot be applied to bigint and number) | TypeError: Cannot mix BigInt and other types | TS2365 line 2 | TypeError | Yes | Engine forbids implicit BigInt + Number conversion |
| p26 | OK | Prints 3 ['Sara', 92, 100] | OK | Prints 3 ['Sara', 92, 100] | Yes | **Tuple Push Blindspot**: `.push()` mutates array without length check |
| p27 | Error (Cannot assign to 'theme' because it is read-only) | TypeError (strict) / sets value | TS2540 line 2 | TypeError | Yes | **as const** creates deeply immutable properties |
| p28 | OK | Prints NaN number true | OK | Prints NaN number true | Yes | `Number("12px")` produces `NaN`, which is typed as `number` |

---

### Reflection and Analysis

1. **Snippets where `tsc` rejects but `node` runs fine:**
   - Snippets: `p01`, `p02`, `p07`, `p08`, `p11`, `p15`, `p16`, `p18`, `p21`, `p22`, `p27`.
   - **What this tells us about Node and types:** Node.js executes pure JavaScript and completely strips away TypeScript types at execution time. It has zero awareness of compile-time constraints, interface violations, or type mismatches.

2. **Snippets where `tsc` accepts but `node` crashes or fails:**
   - Snippets: `p03` (logic issue), `p04`, `p05`, `p06`, `p12`, `p19`, `p25`.
   - **What let the bugs through:** Escape hatches like `any` (which completely disables type checking), unsafe type assertions (`as`), and missing boundary checks allow runtime errors to slip through static checks.

3. **Explicitly Named Mechanisms:**
   - **#2 (Type Widening):** `let other = "A"` infers `string` rather than literal `"A"`.
   - **#4 (noUncheckedIndexedAccess):** Accessing arrays by index yields `T | undefined`.
   - **#9 (Structural Typing):** Objects are checked by shape, bypassing literal excess property checks.
   - **#10 (Shallow Readonly):** `readonly` prevents reassigning the property reference, not interior array mutation.
   - **#14 (Generic Inference):** Generic parameters infer return types directly from argument types.
   - **#19 (Type Assertion via `as`):** Overrides compiler checks, masking missing properties until runtime.
   - **#20 (Enum Runtime Code Generation):** Enums generate JavaScript objects, conflicting with `erasableSyntaxOnly`.
   - **#23 (JS Type Quirks):** Historical language quirks like `typeof null === "object"`.
   - **#26 (Tuple Push Blindspot):** TypeScript allows `.push()` on fixed tuples without updating inferred length.
   - **#27 (Const Assertions `as const`):** Locks down object properties into literal, readonly values.