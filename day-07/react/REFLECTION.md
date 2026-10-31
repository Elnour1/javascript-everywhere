# Project Reflection

### 1. Why is the task card a good candidate for a component?
The task card is an ideal component because it represents a repeatable piece of UI with a consistent structure and design. Extracting it avoids repeating identical markup and styles for every task across the app. It also follows the Single Responsibility Principle, allowing us to pass dynamic props and update the card's appearance or behavior in one single place.

### 2. What happens if a component name starts with a lowercase letter?
React treats JSX elements starting with a lowercase letter as standard built-in HTML tags (like `<div>` or `<span>`). As a result, React will attempt to render a native HTML element instead of invoking your custom function, leading to unexpected behavior or failing to render your component entirely.

### 3. Why do we wrap two sibling elements in `<> </>`?
A React component or JSX expression must return a single root node because JavaScript functions cannot return multiple values without a wrapper, and React's reconciliation process requires a single parent to build the virtual DOM tree. Using a Fragment (`<>...</>`) groups adjacent sibling elements without introducing unnecessary extra DOM nodes (like extra `<div>` tags) that could break flexbox, grid layouts, or semantic markup.
# Day 07 Reflection

### 1. When would you choose `type` over `interface`?
I choose `type` when modeling unions (e.g., `'low' | 'medium' | 'high'`), intersections, primitives, tuples, or utility types, because an `interface` cannot declare a bare union. On the other hand, I prefer `interface` for structural object contracts, props definitions, and public domain models because it allows clean declaration merging and inheritance via `extends`.

### 2. Why do we pass the whole task as one prop?
Passing the whole `task` object as a single prop preserves the structural cohesion of the domain model and prevents "prop drilling" with excessive individual parameters (`title`, `status`, `dueDate`, etc.). It also guarantees that as the entity schema evolves or adds optional fields, component signatures remain clean and easy to refactor without rewriting every parent call-site.

### 3. What does `??` do differently from `||`?
The nullish coalescing operator (`??`) falls back only when the left-hand operand is strictly `null` or `undefined`. In contrast, the logical OR operator (`||`) checks for any falsy value, meaning it will incorrectly trigger the fallback for valid inputs like empty strings (`""`), `0`, or `false`.
# Track 2 Reflection

### 1. Why does `tasks.push(task)` followed by `setTasks(tasks)` not update the screen?
React compares state by reference using `Object.is` to check if a re-render is necessary. Using `tasks.push(task)` mutates the existing array in place without changing its memory reference, so `setTasks(tasks)` receives the exact same array pointer. Because React sees no reference change, it considers the state unchanged and skips the re-render.

### 2. Why is the index a bad key for this list?
Using array indices as keys creates issues when the list changes via sorting, filtering, or deleting tasks. Since indices shift when items are removed or reordered, React confuses which component matches which data, causing incorrect UI updates, broken local states, or animation bugs. A permanent and unique ID ensures React always tracks the exact task correctly.

### 3. Which values in your TaskList are state, and which are derived?
- **State:** `tasks` (the source list of items), `lastDeletedTask` (stores the single deleted task for undo), and `sortMode` (tracks "default" vs "title").
- **Derived (Computed):** `totalTasks` (`tasks.length`), `completedTasks` (`tasks.filter(...).length`), `percentage` (calculated completion rate), and `displayedTasks` (the newly sorted array copy). None of these need their own state because they are calculated dynamically during render from `tasks` and `sortMode`.
# Track 2 Reflection — Part 2

### 1. Why does `useState(initialValues)` not update when `initialValues` changes?
React runs the initial value passed to `useState` only once during the component's initial mount. On subsequent re-renders, React preserves the existing state in memory and ignores the updated prop or argument. To sync state with changing props, you would need an explicit effect or use the prop directly as a key to reset the component instance.

### 2. When is `as StatusFilter` safe, and when is it risky?
Type assertion (`as StatusFilter`) is safe when the input source is strictly controlled and known to contain only valid values, such as the hardcoded `<option>` values inside an application `<select>` element. It becomes risky when used on untrusted, external, or runtime data (like API payloads, query strings, or unvalidated text inputs) because TypeScript skips type checking, allowing unexpected runtime strings to bypass type safety.

### 3. Why do we turn an empty date into `undefined`?
In HTML, an empty date input returns an empty string (`""`), which is truthy in JavaScript and creates ambiguity with optional TypeScript properties typed as `string | undefined`. Converting `""` to `undefined` represents the true absence of a value, prevents invalid date strings from entering business logic or APIs, and makes sorting easier by treating missing dates consistently.