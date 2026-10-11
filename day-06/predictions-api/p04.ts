const res = await fetch("http://localhost:3000/api/tasks/1");
const a: unknown = await res.json();
const b: unknown = await res.json();
console.log(a, b);
