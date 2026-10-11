# Resilient Task Manager Dashboard

A modern, type-safe, accessible single-page task manager built with native TypeScript, semantic HTML5, pure CSS (Grid & Flexbox), and a Node.js REST API with zero external UI dependencies.

---

## Architecture Highlights
- **End-to-End Type Safety**: Shared validation schemas, runtime guards, and models between client and server via `src/shared/`.
- **Fault-Tolerant HTTP Client**: Functional `Result<T>` pattern, exponential retry backoff on 5xx/network errors, and stale request cancellation with `AbortController`.
- **Predictable State Engine**: Unidirectional `State -> Render -> Events` loop using pure DOM manipulation (`createElement` + `textContent`) eliminating XSS vulnerabilities.
- **Accessibility & Contrast**: Built with 100% WCAG AA compliant contrast tokens, dark mode support via `prefers-color-scheme`, and semantic ARIA live regions.

---

## Getting Started

### 1. Install Dependencies
```bash
cd task-manager
npm install