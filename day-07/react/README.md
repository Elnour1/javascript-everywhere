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
# Module 02 — React & TypeScript Components

A modular, strictly-typed Task Manager interface built with React, Vite, and TypeScript.

## Completed Features
- **Strict Domain Typing**: Introduced `Priority` union types and optional attributes on `Task`.
- **Reusable Badge Component**: Dynamic status tones (`neutral`, `warning`, `danger`) typed with `ReactNode`.
- **Typed Sidebar**: Configurable `title` and dynamic `projects` list passed via props.
- **Enhanced Section Layout**: Flexible header with optional `action` slot for task counter badges.
- **Challenge Implementation**: Type-safe task deletion handler (`onDelete`) and event propagation control.

## Build & Test
```bash
npm install
npm run build
npm run dev