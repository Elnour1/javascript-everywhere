import type { Task } from "../types/task";
import type {MouseEvent} from 'react'
interface TaskCardProps {
  task : Task
  variant? : 'default' | 'urgent'
  onSelect: (id:number)=>void
}

function getStatusLabel(status: string): string {
  if (status === "todo") return "To Do";
  if (status === "in-progress") return "In Progress";
  return "Done";
}
function TaskCard({ task, variant= 'default', onSelect }: TaskCardProps) {
  function handleDetailsClick(event: MouseEvent<HTMLButtonElement>)
  {
    console.log(`button clicked`, event.currentTarget.textContent);
    onSelect(task.id);
  }
  return (
    <article className={`task-card task-card-${variant}`}>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">
        {task.description}
      </p>
      <p className = "task-date">{task.dueDate ?? 'No Due Date'}</p>
      <span className={`task-status status-${task.status}`}>{getStatusLabel(task.status)}</span>
      <button className="task-button" onClick={handleDetailsClick}>Details</button>
    </article>
  );
}
export default TaskCard;