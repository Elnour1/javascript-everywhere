const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    body: { title: "Object body" },
});
console.log(res.status);
export {};
