import { useState } from "react";
import { tasks as initialTasks } from "../data/tasks";
import type { Task, TaskStatus, SortOption } from "../types/task";
import TaskCard from "../components/TaskCard";
import TaskFilters from "./TaskFilters";
import Section from "./Section";
import { Badge } from "./Badge";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
   
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 2. فرز المهام المصفاة على نسخة من المصفوفة
  const displayedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }

    return 0;
  });
  const isFilterActive =
    searchQuery.trim() !== "" || statusFilter !== "all" || sortBy !== "default";

 
  function handleClearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("default");
  }

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

      <div
        className="filter-bar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            fontSize: "0.9rem",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <TaskFilters sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <div
        className="results-summary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#4b5563",
        }}
      >
        <span>
          Showing {displayedTasks.length} of {totalTasks}
        </span>

        {isFilterActive && (
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              padding: "0.25rem 0.6rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "#f9fafb",
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            Clear filters
          </button>
        )}
      </div>

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

      {/* قائمة المهام */}
      <div className="task-list">
        {displayedTasks.map((task, index) => (
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