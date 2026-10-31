import { useState } from "react";
import { tasks as initialTasks } from "../data/tasks";
import type { Task } from "../types/task";
import TaskCard, { nextStatus } from "../TaskCard";
import Section from "./Section";
import { Badge } from "./Badge";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  function handleSelectTask(id: number) {
    console.log(`Task selected with id: ${id}`);
  }

  function handleDeleteTask(id: number) {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  }

  function handleUndo() {
    if (lastDeletedTask) {

      setTasks((prevTasks) => [...prevTasks, lastDeletedTask]);
      setLastDeletedTask(null);
    }
  }

  function handleToggleStatus(taskId: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: nextStatus(task.status),
          };
        }
        return task;
      })
    );
  }

  return (
    <Section
      title="My Tasks"
      action={<Badge tone="neutral">{totalTasks}</Badge>}
    >
      <p className="task-progress" style={{ margin: "0 0 1rem 0", color: "#666" }}>
        {totalTasks === 0
          ? "0 tasks (0%)"
          : `${completedTasks} of ${totalTasks} done (${percentage}%)`}
      </p>

      {lastDeletedTask && (
        <div
          className="undo-banner"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        >
          <span>Task deleted</span>
          <span>·</span>
          <button
            type="button"
            onClick={handleUndo}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Undo
          </button>
        </div>
      )}

      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            variant={index === 0 ? "urgent" : "default"}
            onSelect={handleSelectTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>
    </Section>
  );
}

export default TaskList;