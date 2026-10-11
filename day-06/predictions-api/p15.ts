const results = await Promise.allSettled([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3999/api/tasks/1"),
]);
console.log(results.map((r) => r.status));
