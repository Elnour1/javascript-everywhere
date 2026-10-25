import { tasks } from "../data/tasks";
import TaskCard from "./TaskCard";
import Section from "./Section"; 
import {Badge} from "./Badge";     

function TaskList() {
  function handleSelectTask(id: number) {
    console.log(`Task selected with id: ${id}`);
  }

  return (
    <Section
      title="My Tasks"
      action={<Badge tone="neutral">{tasks.length}</Badge>}
    >
      <div className="task-list">
        <TaskCard task={tasks[0]} variant="urgent" onSelect={handleSelectTask} />
        <TaskCard task={tasks[1]} onSelect={handleSelectTask} />
        <TaskCard task={tasks[2]} onSelect={handleSelectTask} />
        <TaskCard task={tasks[3]} onSelect={handleSelectTask} />
      </div>
    </Section>
  );
}

export default TaskList;