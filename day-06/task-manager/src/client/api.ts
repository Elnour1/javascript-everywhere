// =========================================================
// 17.2 & 17.3 — Typed Task API Client with Safe Exponential Retry
// =========================================================

import type { Task, Priority } from "../shared/types.js";
import { isTask } from "../shared/types.js";
import { request, describeError } from "./http.js";
import type { Result, ApiError } from "./http.js";

const BASE_URL = "http://localhost:3000/api/tasks";

// Type guard for an array of tasks
function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

// ---------------------------------------------------------
// 17.3 — Safe Retry Logic
// ---------------------------------------------------------
// We only retry idempotent network reads: network disconnects, timeouts, and 5xx server crashes.
// We NEVER retry non-idempotent operations like POST (createTask) because network dropouts 
// after server creation could cause duplicate resource creations and data corruption.
async function withRetry<T>(
  action: () => Promise<Result<T>>,
  maxRetries = 3,
  delayMs = 300
): Promise<Result<T>> {
  let attempt = 0;
  while (true) {
    const res = await action();
    if (res.ok) return res;

    const err = res.error;
    const isRetryable =
      err.kind === "network" ||
      err.kind === "timeout" ||
      (err.kind === "http" && err.status >= 500);

    if (!isRetryable || attempt >= maxRetries) {
      return res;
    }

    attempt++;
    const backoff = delayMs * Math.pow(2, attempt - 1);
    console.warn(`[Retry #${attempt}/${maxRetries}] Request failed (${err.kind}). Waiting ${backoff}ms...`);
    await new Promise((resolve) => setTimeout(resolve, backoff));
  }
}

// ---------------------------------------------------------
// Public API Functions
// ---------------------------------------------------------

/**
 * Lists all tasks with automatic safe retry on network / 5xx failures.
 */
export async function listTasks(): Promise<Result<Task[]>> {
  return withRetry(() =>
    request<Task[]>(BASE_URL, {
      method: "GET",
      guard: isTaskArray,
    })
  );
}

/**
 * Fetches a single task by ID with safe retry.
 */
export async function getTask(id: number): Promise<Result<Task>> {
  return withRetry(() =>
    request<Task>(`${BASE_URL}/${id}`, {
      method: "GET",
      guard: isTask,
    })
  );
}

/**
 * Creates a new task. Does NOT retry to prevent duplicate records.
 */
export async function createTask(payload: {
  title: string;
  priority?: Priority;
}): Promise<Result<Task>> {
  return request<Task>(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    guard: isTask,
  });
}

/**
 * Updates a task partially.
 */
export async function updateTask(
  id: number,
  patches: { title?: string; priority?: Priority; done?: boolean }
): Promise<Result<Task>> {
  return request<Task>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patches),
    guard: isTask,
  });
}

/**
 * Deletes a task by ID.
 */
export async function deleteTask(id: number): Promise<Result<void>> {
  return request<void>(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}