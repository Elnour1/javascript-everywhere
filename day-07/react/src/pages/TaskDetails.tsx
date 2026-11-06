// @ts-expect-error: react-router-dom is missing in this local setup
import { useParams, Link, useNavigate } from "react-router-dom";
import { tasks } from "../data/tasks";
import { Badge } from "../components/Badge";

export function TaskDetails() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();

  // تحويل taskId إلى رقم للبحث في مصفوفة المهام
  const numericTaskId = taskId ? Number(taskId) : NaN;
  const task = tasks.find((t) => t.id === numericTaskId);

  const backUrl = projectId ? `/projects/${projectId}` : "/";

  // في حال عدم وجود المهمة (Unknown task id)
  if (!task || isNaN(numericTaskId)) {
    return (
      <div style={{ padding: "2rem" }}>
        <div role="status">
          <h2>Task not found</h2>
          <p>The requested task does not exist or may have been deleted.</p>
          <Link
            to={backUrl}
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            ← Back to project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="task-details"
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1.5rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => navigate(backUrl)}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            padding: 0,
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "underline",
          }}
        >
          ← Back to project
        </button>
      </div>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#111827" }}>
          {task.title}
        </h1>
        <Badge tone={task.status === "done" ? "neutral" : "warning"}>
          {task.status}
        </Badge>
      </header>

      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#374151" }}>
          Description
        </h3>
        <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>
          {task.description ? task.description : "No description provided."}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f3f4f6",
          fontSize: "0.9rem",
          color: "#4b5563",
        }}
      >
        <div>
          <span style={{ fontWeight: 600 }}>Status: </span>
          <span>{task.status}</span>
        </div>

        <div>
          <span style={{ fontWeight: 600 }}>Due Date: </span>
          <span>{task.dueDate ? task.dueDate : "No due date"}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;