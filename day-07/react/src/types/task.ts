export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';
export interface Task {
  id: number;
  title: string;
  description?: string;  
  status: TaskStatus;
  priority?: Priority;      
  dueDate?: string;
}

export function nextStatus(status: TaskStatus): TaskStatus {
  switch (status) {
    case "todo":
      return "in-progress";
    case "in-progress":
      return "done";
    case "done":
      return "todo";
  }
}

export function getNextStatusActionLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "Start"; // أو "Move to In Progress"
    case "in-progress":
      return "Complete"; // أو "Mark Done"
    case "done":
      return "Restart"; // أو "Move to To Do"
  }
}
export type SortOption = "default" | "title" | "dueDate";