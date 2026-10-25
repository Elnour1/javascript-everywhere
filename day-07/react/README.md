 # JavaScript Everywhere

**Author:** Nour Elsayed  
**Repository Overview:** A comprehensive learning journey covering modern JavaScript from core fundamentals to advanced full-stack and specialized domains. Each directory represents a dedicated session containing practical tasks, notes, and implementations.

---

## The 7 Tracks of the Journey

* **Track 1: JavaScript Language Mastery** (Core engine, execution contexts, types, asynchronous programming, functional paradigms)
* **Track 2: Browser & Client-Side Engineering** (DOM architecture, browser APIs, event loops, performance optimization)
* **Track 3: Backend & Systems Development** (Node.js runtime, asynchronous I/O, REST APIs, microservices)
* **Track 4: Full-Stack Integration** (Data flow, state management, modern frameworks, full-stack architecture)
* **Track 5: Mobile & Cross-Platform Applications** (Hybrid ecosystems, native APIs, component lifecycles)
* **Track 6: Cloud, DevOps & Serverless Architecture** (CI/CD pipelines, containerization, serverless compute functions)
* **Track 7: Automation, AI & Specialized Domains** (Tooling, scripting, workflow automation, emerging runtime integrations)

---

## Table of Contents

| Session | Topic | Key Files | Status |
| :--- | :--- | :--- | :--- |
| **Day 01** | JavaScript Fundamentals, Browser vs Node, Variables & Loops | `NOTES.md`, `profile.js`, `preview.js`, `grades.js`, `index.html`, `app.js` | Completed |

| Day | Topic | Status |
| --- | --- | --- |
| ... | ... | ... |
| Day 05 | Asynchronous JS (Promises, Async/Await), Modules (CJS/ESM), and Git Workflow | Completed |
| Day 06 | TypeScript, HTTP & Fetch, Resilient Web Architecture | Completed |
## Module 01 Assignment - TaskFlow

- Created and integrated `Footer` and `TaskStats` components.
- Added "Design System" project and fourth in-progress task.
- Ensured fully responsive design across 375px, 768px, and 1280px without overflow.
- Added `REFLECTION.md` covering key architectural questions.
- Built Header user avatar bonus challenge.
# Day 07 Reflection

### 1. When would you choose `type` over `interface`?
I choose `type` when modeling unions (e.g., `'low' | 'medium' | 'high'`), intersections, primitives, tuples, or utility types, because an `interface` cannot declare a bare union. On the other hand, I prefer `interface` for structural object contracts, props definitions, and public domain models because it allows clean declaration merging and inheritance via `extends`.

### 2. Why do we pass the whole task as one prop?
Passing the whole `task` object as a single prop preserves the structural cohesion of the domain model and prevents "prop drilling" with excessive individual parameters (`title`, `status`, `dueDate`, etc.). It also guarantees that as the entity schema evolves or adds optional fields, component signatures remain clean and easy to refactor without rewriting every parent call-site.

### 3. What does `??` do differently from `||`?
The nullish coalescing operator (`??`) falls back only when the left-hand operand is strictly `null` or `undefined`. In contrast, the logical OR operator (`||`) checks for any falsy value, meaning it will incorrectly trigger the fallback for valid inputs like empty strings (`""`), `0`, or `false`.