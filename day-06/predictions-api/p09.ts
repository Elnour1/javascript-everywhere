const res = await fetch("http://localhost:3000/api/tasks/1", { method: "PUT" });
console.log(res.status, res.statusText);
