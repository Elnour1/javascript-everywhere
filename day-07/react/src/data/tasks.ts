import type { Task } from "../types/task";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Sample Task",
    description: "This is a sample task",
    status: "todo",
    priority: "high",  
    dueDate: "2026-11-05",
  },
  {
    id: 2,
    title: "Sample Task 2",
    description: "This is a sample task 2",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Sample Task 3",
    description: "This is a sample task 3",
    status: "done",
    dueDate: "2026-11-12",
   
  },
  {
    id: 4,
    title: "Build Design System Components",
    description: "Create buttons, inputs, and tokens for the Design System",
    status: "in-progress",
    dueDate: "2026-11-20",
  },
];