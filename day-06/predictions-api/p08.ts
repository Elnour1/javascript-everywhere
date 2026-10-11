const res = await fetch("http://localhost:3000/api/tasks/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: "yes" }),
});
console.log(res.status, await res.text());
