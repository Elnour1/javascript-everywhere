import { tasks } from "../data/tasks";
import TaskCard from "./TaskCard";

function TaskList() {
  function handleSelectTask(id: number) {
    console.log(`Task selected with id: ${id}`);
  }
  return (
    <section aria-labelledby="task-list-title">
      <h2 id="task-list-title">My Tasks</h2>
      <TaskCard task={tasks[0]} variant="urgent" onSelect={handleSelectTask} />
      <TaskCard task={tasks[1]} onSelect={handleSelectTask} />
      <TaskCard task={tasks[2]} onSelect={handleSelectTask} />
      <TaskCard task={tasks[3]} onSelect={handleSelectTask} />
    </section>
  );
}

export default TaskList;