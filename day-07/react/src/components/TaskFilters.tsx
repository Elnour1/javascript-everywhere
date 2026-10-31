import type { ChangeEvent } from "react";
import type { SortOption } from "../types/task";

interface TaskFiltersProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function TaskFilters({ sortBy, onSortChange }: TaskFiltersProps) {
  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    onSortChange(e.target.value as SortOption);
  }

  return (
    <div className="task-filters" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <label htmlFor="task-sort-select" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
        Sort by:
      </label>
      <select
        id="task-sort-select"
        value={sortBy}
        onChange={handleSelectChange}
        style={{
          padding: "0.35rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          backgroundColor: "#fff",
          fontSize: "0.9rem",
        }}
      >
        <option value="default">Default</option>
        <option value="title">Title A–Z</option>
        <option value="dueDate">Due date</option>
      </select>
    </div>
  );
}

export default TaskFilters;