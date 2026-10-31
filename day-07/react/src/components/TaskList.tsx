import { useState } from "react";
import { tasks as initialTasks } from "../data/tasks";
import type { Task } from "../types/task";
import TaskCard from "../components/TaskCard";
import Section from "./Section";
import { Badge } from "./Badge";

type SortMode = "default" | "title";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  
  // State لحفظ الـ id الخاص بالمهمة المحددة حالياً
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  function handleSelectTask(id: number) {
    setSelectedTaskId(id);
    console.log(`Task selected with id: ${id}`);
  }

  function handleDeleteTask(id: number) {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      if (selectedTaskId === id) {
        setSelectedTaskId(null);
      }
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
            status:(task.status),
          };
        }
        return task;
      })
    );
  }

  function handleToggleSort() {
    setSortMode((prev) => (prev === "default" ? "title" : "default"));
  }

  const displayedTasks =
    sortMode === "title"
      ? [...tasks].sort((a, b) => a.title.localeCompare(b.title))
      : tasks;

  // دالة التحدي: اختيار المهمة التالية مع الالتفاف التلقائي
  function handleSelectNext() {
    if (displayedTasks.length === 0) return;

    const currentIndex = displayedTasks.findIndex((t) => t.id === selectedTaskId);

    // إذا لم تكن أي مهمة محددة أو كنا في النهاية، نلتف للأول (index 0)
    if (currentIndex === -1 || currentIndex === displayedTasks.length - 1) {
      setSelectedTaskId(displayedTasks[0].id);
    } else {
      setSelectedTaskId(displayedTasks[currentIndex + 1].id);
    }
  }

  return (
    <Section
      title="My Tasks"
      action={
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={handleSelectNext}
            style={{
              padding: "0.25rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Select next
          </button>
          <button
            type="button"
            onClick={handleToggleSort}
            style={{
              padding: "0.25rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Sort: {sortMode}
          </button>
          <Badge tone="neutral">{totalTasks}</Badge>
        </div>
      }
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
        {displayedTasks.map((task, index) => (
          <div
            key={task.id}
            style={{
              outline: selectedTaskId === task.id ? "2px solid #2563eb" : "none",
              borderRadius: "8px",
            }}
          >
            <TaskCard
              task={task}
              variant={index === 0 ? "urgent" : "default"}
              onSelect={handleSelectTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default TaskList;