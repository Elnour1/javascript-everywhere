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
# Track 2 Reflection — Part 3

### 1. What happens to an effect without a cleanup in StrictMode?
In development mode, React StrictMode deliberately mounts, unmounts, and remounts components twice to expose hidden bugs and resource leaks. If an effect sets up subscriptions, intervals, or event listeners without returning a cleanup function, the original side effect remains active in memory. This leads to duplicated listeners, memory leaks, and unexpected duplicate actions running in the background.

### 2. Why does `useState(readJson(...))` read storage on every render?
JavaScript evaluates function arguments before passing them into `useState`, so `readJson(...)` executes synchronously on every single re-render of the component. While React only uses the returned value on the initial mount, the disk reading and JSON parsing still happen repeatedly on every cycle. Passing an initializer function instead (`useState(() => readJson(...))`) defers execution so storage is accessed only once during initial mount.

### 3. When is `useMemo` not worth it?
`useMemo` is not worth it for inexpensive, lightweight calculations such as simple filtering, basic math, or string manipulation on small arrays. Caching values introduces overhead because React must allocate memory for the memoized result and compare the dependency array on every render. If that caching overhead costs more time and memory than simply recalculating the expression, `useMemo` degrades performance instead of optimizing it.
# Project Architecture & Directory Structure

This document outlines the organization and responsibilities of the directories located inside `src/`.

### Folder Responsibilities:
- **`src/components/`**: Reusable UI components and presentational building blocks (e.g., `Badge`, `TaskCard`, `Section`, `EmptyState`, `TaskFilters`, `TaskForm`).
- **`src/pages/`**: Top-level route views and page containers; **this is where any new page (e.g., a new dashboard or settings view) must be placed**.
- **`src/hooks/`**: Custom React hooks encapsulating reusable stateful and side-effect logic; **this is where any new custom hook (e.g., `useLocalStorage`, `useDocumentTitle`) must be placed**.
- **`src/data/`**: Static datasets, initial mock collections, and seed configurations (e.g., `tasks.ts`, `projects.ts`).
- **`src/types/`**: Shared TypeScript definitions, interfaces, and union types ensuring application-wide type safety (e.g., `task.ts`, `project.ts`).
- **`src/utils/`**: Generic, pure helper functions and utility routines that operate independently of React components (e.g., `countBy.ts`).
# Track 2 Reflection — Routing & Architecture

### 1. Why can't `TaskList` call `useTasks()` directly on every page?
If `TaskList` fetches all tasks globally via `useTasks()` on its own, it couples the presentational view to the entire global dataset. Different pages require different scopes (e.g., all tasks vs. tasks filtered strictly by `projectId`). Passing tasks down as props or scoping the hook to the active route parameter allows `TaskList` to remain a reusable, modular component across any view.

### 2. What does the `end` prop on `NavLink` fix?
By default, React Router's `NavLink` considers a link active if the current URL begins with the link's `to` path. For root or parent paths like `/projects`, every nested route (such as `/projects/design-system`) matches as a prefix, keeping the parent link permanently active. Adding the `end` prop enforces an exact match, ensuring the parent link is highlighted only when the URL ends exactly at that path.

### 3. Why does `ProjectPage` give `TaskList` a `key`?
When switching between projects (e.g., from `/projects/1` to `/projects/2`), React reuses the existing `TaskList` component instance by default instead of remounting it. Passing a dynamic key such as `key={projectId}` forces React to unmount the previous instance and mount a fresh one. This automatically resets internal component states (like filters, local selection, and undo queues) cleanly for the newly selected project.