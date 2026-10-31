import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Task, Priority } from "../types/task";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
  onCancel?: () => void;
}

export function TaskForm({ onAddTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dateError, setDateError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

 
  const isDirty =
    title.trim() !== "" ||
    description.trim() !== "" ||
    dueDate !== "" ||
    priority !== "medium";

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (value.length <= 200) {
      setDescription(value);
    }
  }

  function handleResetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setDateError(null);
  }

  function handleCancel() {
    if (isDirty) {
      const confirmDiscard = window.confirm("Discard changes?");
      if (!confirmDiscard) {
        return;
      }
    }

    handleResetForm();
    onCancel?.();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    if (dueDate && dueDate < today) {
      setDateError("Due date cannot be in the past");
      return;
    }

    setDateError(null);

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate : undefined,
      priority,
      status: "todo",
    });

    handleResetForm();
  }

  const descLength = description.length;
  const isNearLimit = descLength > 180;

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      <div className="form-group">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="task-description">Description</label>
          <span
            style={{
              fontSize: "0.8rem",
              color: isNearLimit ? "#dc2626" : "#6b7280",
              fontWeight: isNearLimit ? 600 : 400,
            }}
          >
            {descLength} / 200
          </span>
        </div>
        <textarea
          id="task-description"
          value={description}
          onChange={handleDescriptionChange}
          maxLength={200}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-due-date">Due Date</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (dateError) setDateError(null);
          }}
        />
        {dateError && (
          <p
            role="alert"
            style={{
              color: "#dc2626",
              fontSize: "0.85rem",
              margin: "0.25rem 0 0 0",
            }}
          >
            {dateError}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button type="submit" className="task-button">
          Add Task
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;