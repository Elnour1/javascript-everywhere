// ============================================================================
// Task 20 — Frontend Application: Pure DOM Renderer & Predictable State Engine
// ============================================================================

import type { Task, Priority } from "../shared/types.js";
import { validateNewTask } from "../shared/types.js";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api.js";
import { describeError } from "./http.js";

// ----------------------------------------------------------------------------
// 20.1: State Definitions & Discriminated Union View Types
// ----------------------------------------------------------------------------
type View =
  | { readonly status: "loading" }
  | { readonly status: "failed"; readonly message: string }
  | { readonly status: "ready" };

type FilterMode = "all" | "active" | "done";

interface AppState {
  readonly view: View;
  readonly tasks: readonly Task[];
  readonly pendingTaskIds: ReadonlySet<number>;
  readonly filter: FilterMode;
  readonly searchQuery: string;
  readonly isSubmitting: boolean;
  readonly statusMessage: string;
}

let state: AppState = {
  view: { status: "loading" },
  tasks: [],
  pendingTaskIds: new Set<number>(),
  filter: "all",
  searchQuery: "",
  isSubmitting: false,
  statusMessage: "Initializing task dashboard...",
};

function setState(updater: (prev: AppState) => AppState): void {
  // Capture active element identifier before re-rendering so keyboard focus survives
  const activeEl = document.activeElement as HTMLElement | null;
  const activeId = activeEl?.id || activeEl?.getAttribute("data-action-id") || null;

  state = updater(state);
  render();

  // Restore keyboard focus if element exists in the new tree
  if (activeId) {
    const elToFocus =
      document.getElementById(activeId) ||
      document.querySelector(`[data-action-id="${activeId}"]`);
    if (elToFocus instanceof HTMLElement) {
      elToFocus.focus();
    }
  }
}

// ----------------------------------------------------------------------------
// 20.2: Application Actions & Side Effects
// ----------------------------------------------------------------------------

async function loadInitialTasks(): Promise<void> {
  setState((s) => ({
    ...s,
    view: { status: "loading" },
    statusMessage: "Fetching tasks from server...",
  }));

  const res = await listTasks();
  if (res.ok) {
    setState((s) => ({
      ...s,
      view: { status: "ready" },
      tasks: res.value,
      statusMessage: `Loaded ${res.value.length} tasks successfully.`,
    }));
  } else {
    setState((s) => ({
      ...s,
      view: { status: "failed", message: describeError(res.error) },
      statusMessage: "Error loading tasks.",
    }));
  }
}

async function handleAddTask(form: HTMLFormElement): Promise<void> {
  const formData = new FormData(form);
  const rawTitle = formData.get("title");
  const rawPriority = formData.get("priority");

  const validation = validateNewTask({ title: rawTitle, priority: rawPriority });
  const errorBox = document.getElementById("form-error");

  if (!validation.valid || !validation.clean) {
    if (errorBox) {
      errorBox.textContent = validation.errors.join(" ");
      errorBox.style.display = "block";
    }
    return;
  }

  if (errorBox) {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }

  setState((s) => ({ ...s, isSubmitting: true, statusMessage: "Creating task..." }));

  try {
    const res = await createTask(validation.clean);
    if (res.ok) {
      form.reset();
      setState((s) => ({
        ...s,
        tasks: [res.value, ...s.tasks],
        statusMessage: `Created task "${res.value.title}".`,
      }));
    } else {
      setState((s) => ({
        ...s,
        statusMessage: `Failed to create task: ${describeError(res.error)}`,
      }));
    }
  } finally {
    setState((s) => ({ ...s, isSubmitting: false }));
  }
}

// Optimistic Toggle with Rollback
async function handleToggleTask(task: Task): Promise<void> {
  const previousDone = task.done;
  const nextDone = !task.done;

  // 1. Optimistic Update
  setState((s) => ({
    ...s,
    tasks: s.tasks.map((t) => (t.id === task.id ? { ...t, done: nextDone } : t)),
    statusMessage: `Updating task #${task.id}...`,
  }));

  const res = await updateTask(task.id, { done: nextDone });
  if (!res.ok) {
    // 2. Rollback on Failure
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === task.id ? { ...t, done: previousDone } : t)),
      statusMessage: `Failed to update task #${task.id}. Rolled back.`,
    }));
  } else {
    setState((s) => ({
      ...s,
      statusMessage: `Task #${task.id} marked as ${nextDone ? "done" : "active"}.`,
    }));
  }
}

// Pessimistic Priority Change
async function handleChangePriority(id: number, nextPriority: Priority): Promise<void> {
  // Mark row as pending
  setState((s) => {
    const nextSet = new Set(s.pendingTaskIds);
    nextSet.add(id);
    return { ...s, pendingTaskIds: nextSet, statusMessage: `Saving priority for #${id}...` };
  });

  const res = await updateTask(id, { priority: nextPriority });

  setState((s) => {
    const nextSet = new Set(s.pendingTaskIds);
    nextSet.delete(id);
    if (res.ok) {
      return {
        ...s,
        pendingTaskIds: nextSet,
        tasks: s.tasks.map((t) => (t.id === id ? res.value : t)),
        statusMessage: `Updated priority for #${id} to ${nextPriority}.`,
      };
    }
    return {
      ...s,
      pendingTaskIds: nextSet,
      statusMessage: `Failed to change priority for #${id}: ${describeError(res.error)}`,
    };
  });
}

// Delete Task (Treat 404 as already deleted)
async function handleDeleteTask(id: number): Promise<void> {
  const res = await deleteTask(id);
  const isDeleted = res.ok || (res.error.kind === "http" && res.error.status === 404);

  if (isDeleted) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.filter((t) => t.id !== id),
      statusMessage: `Task #${id} deleted.`,
    }));
  } else {
    setState((s) => ({
      ...s,
      statusMessage: `Could not delete task #${id}: ${describeError(res.error)}`,
    }));
  }
}

// Clear Completed in Parallel
async function handleClearCompleted(): Promise<void> {
  const completed = state.tasks.filter((t) => t.done);
  if (completed.length === 0) return;

  setState((s) => ({ ...s, statusMessage: `Clearing ${completed.length} completed tasks...` }));

  const results = await Promise.all(
    completed.map(async (t) => {
      const res = await deleteTask(t.id);
      const ok = res.ok || (res.error.kind === "http" && res.error.status === 404);
      return { id: t.id, ok };
    })
  );

  const successfulIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
  const failedCount = results.length - successfulIds.size;

  setState((s) => ({
    ...s,
    tasks: s.tasks.filter((t) => !successfulIds.has(t.id)),
    statusMessage: `Cleared ${successfulIds.size} completed tasks. ${
      failedCount > 0 ? `Failed to delete ${failedCount}.` : ""
    }`.trim(),
  }));
}

// ----------------------------------------------------------------------------
// 20.1 & 20.2: Pure DOM Renderer (NO innerHTML)
// ----------------------------------------------------------------------------

function render(): void {
  // 1. Status Announcement Area
  const statusEl = document.getElementById("live-region");
  if (statusEl) {
    // Exhaustive switch over view.status
    let statusText = "";
    switch (state.view.status) {
      case "loading":
        statusText = "Loading... " + state.statusMessage;
        break;
      case "failed":
        statusText = "Error: " + state.view.message;
        break;
      case "ready":
        statusText = state.statusMessage;
        break;
      default: {
        const _exhaustive: never = state.view;
        statusText = String(_exhaustive);
      }
    }
    statusEl.textContent = statusText;
  }

  // 2. Add Button Disable State
  const submitBtn = document.querySelector("#create-task-form button[type='submit']") as HTMLButtonElement | null;
  if (submitBtn) {
    submitBtn.disabled = state.isSubmitting;
    submitBtn.textContent = state.isSubmitting ? "Adding..." : "Create Task";
  }

  // 3. Render List and Controls
  const container = document.getElementById("task-list-container");
  if (!container) return;

  // Wipe previous children cleanly via DOM manipulation
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Loading View
  if (state.view.status === "loading") {
    const p = document.createElement("p");
    p.textContent = "Loading tasks from server...";
    container.appendChild(p);
    return;
  }

  // Failed View
  if (state.view.status === "failed") {
    const box = document.createElement("div");
    const msg = document.createElement("p");
    msg.textContent = `Failed to load: ${state.view.message}`;
    const retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.textContent = "Try again";
    retryBtn.addEventListener("click", () => void loadInitialTasks());
    box.appendChild(msg);
    box.appendChild(retryBtn);
    container.appendChild(box);
    return;
  }

  // Ready View: Compute filtered tasks
  const query = state.searchQuery.toLowerCase().trim();
  const filteredTasks = state.tasks.filter((t) => {
    if (state.filter === "active" && t.done) return false;
    if (state.filter === "done" && !t.done) return false;
    if (query && !t.title.toLowerCase().includes(query)) return false;
    return true;
  });

  const activeCount = state.tasks.filter((t) => !t.done).length;
  const doneCount = state.tasks.filter((t) => t.done).length;

  // Toolbar (Counts, Search, Filters, Clear)
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search tasks...";
  searchInput.value = state.searchQuery;
  searchInput.setAttribute("aria-label", "Search tasks");
  searchInput.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value;
    setState((s) => ({ ...s, searchQuery: val }));
  });
  toolbar.appendChild(searchInput);

  // Filters group
  const filterGroup = document.createElement("div");
  const filters: FilterMode[] = ["all", "active", "done"];
  for (const f of filters) {
    const fBtn = document.createElement("button");
    fBtn.type = "button";
    fBtn.className = state.filter === f ? "btn-active" : "btn-secondary";
    fBtn.textContent = `${f.toUpperCase()} (${f === "all" ? state.tasks.length : f === "active" ? activeCount : doneCount})`;
    fBtn.setAttribute("aria-pressed", state.filter === f ? "true" : "false");
    fBtn.addEventListener("click", () => {
      setState((s) => ({ ...s, filter: f }));
    });
    filterGroup.appendChild(fBtn);
  }
  toolbar.appendChild(filterGroup);

  // Clear completed button
  if (doneCount > 0) {
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn-secondary";
    clearBtn.textContent = "Clear completed";
    clearBtn.addEventListener("click", () => void handleClearCompleted());
    toolbar.appendChild(clearBtn);
  }

  container.appendChild(toolbar);

  // Empty State Scenarios
  if (state.tasks.length === 0) {
    const emptyP = document.createElement("p");
    emptyP.className = "empty-state";
    emptyP.textContent = "No tasks yet. Create one on the left!";
    container.appendChild(emptyP);
    return;
  }

  if (filteredTasks.length === 0) {
    const noMatchP = document.createElement("p");
    noMatchP.className = "empty-state";
    noMatchP.textContent = `No tasks match filter "${state.filter}" or query "${state.searchQuery}".`;
    container.appendChild(noMatchP);
    return;
  }

  // Task List
  const ul = document.createElement("ul");
  ul.id = "task-list";

  for (const task of filteredTasks) {
    const isPending = state.pendingTaskIds.has(task.id);

    const li = document.createElement("li");
    li.className = "task-item";
    li.setAttribute("data-priority", task.priority);
    li.setAttribute("data-done", String(task.done));
    if (isPending) li.setAttribute("aria-busy", "true");

    // Left info
    const infoDiv = document.createElement("div");
    infoDiv.className = "task-info";

    const badge = document.createElement("span");
    badge.className = "priority-badge";
    badge.textContent = task.priority;
    infoDiv.appendChild(badge);

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.textContent = ` ${task.title}`;
    infoDiv.appendChild(titleSpan);

    li.appendChild(infoDiv);

    // Right actions
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Priority selector (Pessimistic)
    const select = document.createElement("select");
    select.setAttribute("aria-label", `Change priority for ${task.title}`);
    select.setAttribute("data-action-id", `priority-${task.id}`);
    select.disabled = isPending;
    for (const p of ["low", "normal", "high"] as const) {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      if (task.priority === p) opt.selected = true;
      select.appendChild(opt);
    }
    actionsDiv.appendChild(select);

    // Toggle button (Optimistic)
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "btn-secondary";
    toggleBtn.setAttribute("data-action-id", `toggle-${task.id}`);
    toggleBtn.textContent = task.done ? "Mark Undone" : "Mark Done";
    toggleBtn.disabled = isPending;
    actionsDiv.appendChild(toggleBtn);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-danger";
    delBtn.setAttribute("data-action-id", `delete-${task.id}`);
    delBtn.textContent = "Delete";
    delBtn.disabled = isPending;
    actionsDiv.appendChild(delBtn);

    li.appendChild(actionsDiv);
    ul.appendChild(li);
  }

  // Single delegated listener on the list
  ul.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const actionId = target.getAttribute("data-action-id");
    if (!actionId) return;

    const [action, rawId] = actionId.split("-");
    const id = Number(rawId);
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    if (action === "toggle") {
      void handleToggleTask(task);
    } else if (action === "delete") {
      void handleDeleteTask(id);
    }
  });

  ul.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    const actionId = target.getAttribute("data-action-id");
    if (!actionId) return;

    const [, rawId] = actionId.split("-");
    const id = Number(rawId);
    const nextPriority = target.value as Priority;
    void handleChangePriority(id, nextPriority);
  });

  container.appendChild(ul);
}

// ----------------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-task-form") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      void handleAddTask(form);
    });
  }

  void loadInitialTasks();
});