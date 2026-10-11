const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hi", priority: "urgent" }),
});
const body = (await res.json());
console.log(res.status, body.error);
export {};
