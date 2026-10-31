import { useState } from "react";
import { tasks as initialTasks } from "../data/tasks";
import TaskCard from "../components/TaskCard";
import Section from "./Section";
import { Badge } from "./Badge";

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  // 1. حساب القيم المشتقة (Computed, not stored in state)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  function handleSelectTask(id: number) {
    console.log(`Task selected with id: ${id}`);
  }

  function handleDeleteTask(id: number) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function handleToggleStatus(taskId: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === "done" ? "todo" : "done",
          };
        }
        return task;
      })
    );
  }

  return (
    <Section
      title="My Tasks"
      action={<Badge tone="neutral">{totalTasks}</Badge>}>
      <p className="task-progress" style={{ margin: "0 0 1rem 0", color: "#666" }}>
        {totalTasks === 0
          ? "0 tasks (0%)"
          : `${completedTasks} of ${totalTasks} done (${percentage}%)`}
      </p>

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