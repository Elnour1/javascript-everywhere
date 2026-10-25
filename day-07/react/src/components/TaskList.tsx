import { tasks } from "../data/tasks";
import TaskCard from "./TaskCard";
import Section from "./Section";
import {Badge} from "./Badge";

function TaskList() {
  function handleSelectTask(id: number) {
    console.log(`Task selected with id: ${id}`);
  }

  function handleDeleteTask(id: number) {
    console.log(`Deleting task with id: ${id}`);
  }

  return (
    <Section
      title="My Tasks"
      action={<Badge tone="neutral">{tasks.length}</Badge>}
    >
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            variant={index === 0 ? "urgent" : "default"}
            onSelect={handleSelectTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </Section>
  );
}

export default TaskList;