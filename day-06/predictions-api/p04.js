const res = await fetch("http://localhost:3000/api/tasks/1");
const a = await res.json();
const b = await res.json();
console.log(a, b);
export {};
