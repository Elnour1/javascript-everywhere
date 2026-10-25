import type { Task } from "../types/task";
import { Badge } from "./Badge";
import type { MouseEvent } from "react";

interface TaskCardProps {
  task: Task;
  variant?: "default" | "urgent";
  onSelect: (id: number) => void;
  onDelete: (id: number) => void; // إضافة الخاصية الجديدة
}

function getStatusLabel(status: string): string {
  if (status === "todo") return "To Do";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

export function TaskCard({
  task,
  variant = "default",
  onSelect,
  onDelete,
}: TaskCardProps) {
  function handleDetailsClick(event: MouseEvent<HTMLButtonElement>) {
    console.log("button clicked", event.currentTarget.textContent);
    onSelect(task.id);
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation(); // يمنع تداخل النقر مع كارت المهمة
    onDelete(task.id);
  }

  const priority = task.priority ?? "medium";

  const toneMap: Record<"low" | "medium" | "high", "neutral" | "warning" | "danger"> = {
    low: "neutral",
    medium: "warning",
    high: "danger",
  };

  const badgeTone = toneMap[priority];

  return (
    <article className={`task-card task-card-${variant}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <Badge tone={badgeTone}>{priority}</Badge>
      </div>
      <p className="task-description">{task.description}</p>
      <p className="task-date">{task.dueDate ?? "No Due Date"}</p>
      <span className={`task-status status-${task.status}`}>
        {getStatusLabel(task.status)}
      </span>
      <div className="task-actions">
        <button className="task-button" onClick={handleDetailsClick}>
          Details
        </button>
        <button className="task-button task-button--danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;