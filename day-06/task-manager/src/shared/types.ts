export type Priority = "low" | "normal" | "high";

export interface Task {
  readonly id: number;
  title: string;
  priority: Priority;
  done: boolean;
  dueDate?: string | null; // New field: optional/nullable for backward compatibility
}

export interface NewTask {
  title: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface TaskUpdate {
  title?: string;
  priority?: Priority;
  done?: boolean;
  dueDate?: string | null;
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  const validDueDate =
    t.dueDate === undefined ||
    t.dueDate === null ||
    (typeof t.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate));

  return (
    typeof t.id === "number" &&
    typeof t.title === "string" &&
    (t.priority === "low" || t.priority === "normal" || t.priority === "high") &&
    typeof t.done === "boolean" &&
    validDueDate
  );
}

export function validateTitle(title: unknown): { valid: boolean; error?: string; clean?: string } {
  if (typeof title !== "string") {
    return { valid: false, error: "Title must be a string." };
  }
  const clean = title.trim();
  if (clean.length === 0) {
    return { valid: false, error: "Title cannot be blank." };
  }
  if (clean.length > 120) {
    return { valid: false, error: "Title cannot exceed 120 characters." };
  }
  return { valid: true, clean };
}

export function validateDueDate(dueDate: unknown): { valid: boolean; error?: string; clean?: string | null } {
  if (dueDate === undefined || dueDate === null || dueDate === "") {
    return { valid: true, clean: null };
  }
  if (typeof dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { valid: false, error: "Due date must be in YYYY-MM-DD format." };
  }
  return { valid: true, clean: dueDate };
}

export function validateNewTask(data: { title: unknown; priority: unknown; dueDate?: unknown }): {
  valid: boolean;
  errors: string[];
  clean?: NewTask;
} {
  const errors: string[] = [];
  const titleCheck = validateTitle(data.title);
  if (!titleCheck.valid && titleCheck.error) errors.push(titleCheck.error);

  const priority = data.priority;
  if (priority !== "low" && priority !== "normal" && priority !== "high") {
    errors.push("Priority must be 'low', 'normal', or 'high'.");
  }

  const dateCheck = validateDueDate(data.dueDate);
  if (!dateCheck.valid && dateCheck.error) errors.push(dateCheck.error);

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    clean: {
      title: titleCheck.clean!,
      priority: priority as Priority,
      dueDate: dateCheck.clean ?? null,
    },
  };
}