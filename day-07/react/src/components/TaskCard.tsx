import type { Task } from "../types/task";
import { Badge } from "./Badge";

interface TaskCardProps {
  task: Task;
  variant?: "default" | "urgent";
  onSelect?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

export function TaskCard({
  task,
  variant = "default",
  onSelect,
  onDelete,
  onToggleStatus,
}: TaskCardProps) {
  const projectId = window.location.pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? "1";

  return (
    <div
      className={`task-card ${variant === "urgent" ? "task-card--urgent" : ""}`}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "0.75rem",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4
          onClick={() => onSelect?.(task.id)}
          style={{ margin: 0, cursor: "pointer", fontSize: "1.05rem" }}
        >
          {task.title}
        </h4>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <a
            href={`/projects/${projectId}/tasks/${task.id}`}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.8rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "#f9fafb",
              cursor: "pointer",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Details
          </a>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              style={{ cursor: "pointer" }}
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggleStatus?.(task.id)}
            style={{ cursor: "pointer", border: "none", background: "none" }}
          >
            <Badge tone={task.status === "done" ? "neutral" : "warning"}>
              {task.status}
            </Badge>
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ margin: "0.5rem 0", color: "#6b7280", fontSize: "0.9rem" }}>
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <small style={{ color: "#9ca3af", display: "block", marginTop: "0.5rem" }}>
          Due: {task.dueDate}
        </small>
      )}
    </div>
  );
}

export default TaskCard;