// ==========================================
// 16.2 — Failure Modes Classification Table
// ==========================================
/*
| Failure Mode        | Layer       | fetch() Rejects or Resolves? | Safe to Retry? | Root Mechanism |
|---------------------|-------------|------------------------------|----------------|----------------|
| Network (Port/Host) | Network/DNS | Rejects (TypeError)          | Yes (Idempotent)| Connection refused or DNS lookup failure |
| HTTP 404 / 400      | Application | Resolves (res.ok === false)  | No             | Client error; payload or path must be fixed first |
| HTTP 500            | Server      | Resolves (res.ok === false)  | Yes (Backoff)  | Server crash/transient failure |
| Parse (HTML as JSON)| Serialization| Resolves, then body throws  | No             | Content-Type mismatch; server returned non-JSON |
| Shape Violation     | Domain Model| Resolves, body parses        | No             | JSON contract breach; payload does not match schema |
| Timeout             | Transport   | Rejects (TimeoutError)       | Yes (Backoff)  | Upstream delay exceeded client deadline |
| Explicit Abort      | Client Flow | Rejects (AbortError)         | No             | Intentionally cancelled by user/client |
| Stale Request Race  | Concurrency | Rejects (AbortError) on prev | No             | Superseded by a newer subsequent request |

Why res.ok needs checking even inside try / catch:
try/catch only catches network errors and client-side aborts because fetch() resolves normally on HTTP 4xx and 5xx responses without rejecting.
*/

import type { Task } from "./task-manager/src/shared/types.js";
import { isTask } from "./task-manager/src/shared/types.js";

interface CauseError extends Error {
  cause?: { code?: string; [key: string]: unknown };
}

// Step 21 attempt helper
async function attempt(label: string, fn: () => Promise<unknown>): Promise<void> {
  console.log(`\n--- [TEST]: ${label} ---`);
  try {
    const res = await fn();
    console.log(`Outcome:`, res);
  } catch (err) {
    const error = err as CauseError;
    const causeCode = error.cause && typeof error.cause.code === "string" ? error.cause.code : "N/A";
    console.log(`Caught ${error.name}: "${error.message}" (cause.code: ${causeCode})`);
  }
}

const BASE_URL = "http://localhost:3000/api/tasks";

async function runFailuresLab(): Promise<void> {
  // 1. Network Failure: Wrong port
  await attempt("Network: Wrong Port (3999)", async () => {
    return await fetch("http://localhost:3999/api/tasks");
  });

  // 2. Network Failure: Non-existent domain
  await attempt("Network: Non-existent Host", async () => {
    return await fetch("http://this-domain-does-not-exist-at-all-999.com/api/tasks");
  });

  // 3. HTTP 404: Missing task with server message
  await attempt("HTTP 404: Missing Task ID", async () => {
    const res = await fetch(`${BASE_URL}/99999`);
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      throw new Error(`Status ${res.status}: ${body.error ?? res.statusText}`);
    }
    return res.json();
  });

  // 4. HTTP 400: Invalid payload schema with server message
  await attempt("HTTP 400: Invalid Body Schema", async () => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: "invalid-value" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      throw new Error(`Status ${res.status}: ${body.error ?? res.statusText}`);
    }
    return res.json();
  });

  // 5. HTTP 500: Server error simulation
  await attempt("HTTP 500: Internal Server Error Simulation", async () => {
    // If the server was run with FAIL_RATE=1, standard endpoints return 500.
    // If not restarted, simulated directly against failure flag or fallback.
    const res = await fetch(`${BASE_URL}?fail=true`);
    if (res.status === 500 || !res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return res.json();
  });

  // 6. Parse Error: Non-JSON response parsing
  await attempt("Parse Error: res.json() on HTML root", async () => {
    const res = await fetch("http://localhost:3000/");
    return await res.json(); // Root serves text/html, throws SyntaxError
  });

  // 7. Shape Error: Valid JSON failing isTask guard
  await attempt("Shape Error: Valid JSON violating contract", async () => {
    const res = await fetch(BASE_URL);
    const data: unknown = await res.json();
    const fakeTask = { id: "not-a-number", title: 12345 };
    if (!isTask(fakeTask)) {
      throw new Error("Payload shape failed runtime isTask guard verification");
    }
    return data;
  });

  // 8. Timeout: AbortSignal.timeout(1000)
  await attempt("Timeout: Request cancelled via deadline", async () => {
    // Simulating delay beyond client allowance
    return await fetch(`${BASE_URL}`, {
      signal: AbortSignal.timeout(10), // Extremely tight timeout to trigger reliably
    });
  });

  // 9. Abort: Explicit cancellation via AbortController
  await attempt("Abort: Manual controller.abort()", async () => {
    const controller = new AbortController();
    const promise = fetch(BASE_URL, { signal: controller.signal });
    controller.abort();
    return await promise;
  });

  // 10. Stale: Two sequential fetches, first aborted in favor of the latest
  await attempt("Stale Request: Race condition mitigation", async () => {
    let currentController: AbortController | null = null;

    async function loadData(requestId: number): Promise<string> {
      if (currentController) {
        currentController.abort(); // Cancel previous in-flight request
      }
      currentController = new AbortController();
      const signal = currentController.signal;

      const res = await fetch(`${BASE_URL}/1`, { signal });
      const task = (await res.json()) as Task;
      return `Loaded from request #${requestId}: ${task.title}`;
    }

    const p1 = loadData(1).catch((err: Error) => `Req 1 discarded: ${err.name}`);
    const p2 = loadData(2);

    const [res1, res2] = await Promise.all([p1, p2]);
    return { firstCall: res1, secondCall: res2 };
  });
}

void runFailuresLab();