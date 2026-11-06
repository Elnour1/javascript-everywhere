import { useEffect, useState } from "react";
import type { Task, StatusFilter } from "../types/task";
import TaskCard from "./TaskCard";
import Section from "./Section";
import { Badge } from "./Badge";

interface TaskListProps {
  tasks: Task[];
  title?: string;
}

export function TaskList({ tasks: initialTasks, title = "My Tasks" }: TaskListProps) {
  const [searchParams, setUrlSearchParams] = useState(
    () => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search),
  );

  useEffect(() => {
    function syncSearchParams() {
      setUrlSearchParams(new URLSearchParams(window.location.search));
    }

    window.addEventListener("popstate", syncSearchParams);
    return () => window.removeEventListener("popstate", syncSearchParams);
  }, []);

  function setSearchParams(updater: (prev: URLSearchParams) => URLSearchParams) {
    const next = updater(new URLSearchParams(window.location.search));
    const query = next.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.pushState(null, "", url);
    setUrlSearchParams(next);
  }

  // 1. استخراج القيم من الـ URL كـ Single Source of Truth
  const searchQuery = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status");
  const statusFilter: StatusFilter =
    statusParam === "todo" || statusParam === "in-progress" || statusParam === "done"
      ? statusParam
      : "all";

  // دالة مساعدة لتحديث معاملات الرابط مع حذف القيم الافتراضية/الفارغة لإبقاء الرابط نظيفاً
  function updateFilters(updates: { search?: string; status?: StatusFilter }) {
    setSearchParams((prev: URLSearchParams) => {
      const next = new URLSearchParams(prev);

      if (updates.search !== undefined) {
        if (updates.search.trim()) {
          next.set("search", updates.search);
        } else {
          next.delete("search");
        }
      }

      if (updates.status !== undefined) {
        if (updates.status !== "all") {
          next.set("status", updates.status);
        } else {
          next.delete("status");
        }
      }

      return next;
    });
  }

  // 2. تطبيق الفلترة بالاعتماد على القيم المشتقة من الـ URL
  const filteredTasks = initialTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(task.description?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const isFilterActive = searchQuery !== "" || statusFilter !== "all";

  function handleClearFilters() {
    setSearchParams((prev: URLSearchParams) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      next.delete("status");
      return next;
    });
  }

  return (
    <Section title={title} action={<Badge tone="neutral">{initialTasks.length}</Badge>}>
      {/* شريط الفلاتر متصل مباشرة بـ URL Search Params */}
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
          onChange={(e) => updateFilters({ search: e.target.value })}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => updateFilters({ status: e.target.value as StatusFilter })}
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
      </div>

      <div
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
          Showing {filteredTasks.length} of {initialTasks.length}
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

      <div className="task-list">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </Section>
  );
}

export default TaskList;