const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "  Trim me  " }),
});
const task = (await res.json());
console.log(res.status, JSON.stringify(task.title), task.priority, task.done);
export {};
