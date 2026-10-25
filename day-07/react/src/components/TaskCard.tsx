import type { Task } from "../types/task";
import { Badge } from "./Badge";
import type { MouseEvent } from "react";

interface TaskCardProps {
  task: Task;
  variant?: "default" | "urgent";
  onSelect: (id: number) => void;
}

function getStatusLabel(status: string): string {
  if (status === "todo") return "To Do";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

export function TaskCard({ task, variant = "default", onSelect }: TaskCardProps) {
  function handleDetailsClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(`button clicked`, event.currentTarget.textContent);
    onSelect(task.id);
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
      <h3 className="task-title">{task.title}</h3>
      <Badge tone={badgeTone}>{priority}</Badge>
      <p className="task-description">{task.description}</p>
      <p className="task-date">{task.dueDate ?? "No Due Date"}</p>
      <span className={`task-status status-${task.status}`}>
        {getStatusLabel(task.status)}
      </span>
      <button className="task-button" onClick={handleDetailsClick}>
        Details
      </button>
    </article>
  );
}

export default TaskCard;