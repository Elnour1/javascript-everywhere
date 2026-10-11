const results = await Promise.all([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3000/api/tasks/999"),
]);
console.log(results.map((r) => r.status));
