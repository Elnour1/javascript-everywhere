const url = "http://localhost:3000/api/tasks/3";
const first = await fetch(url, { method: "DELETE" });
const second = await fetch(url, { method: "DELETE" });
console.log(first.status, second.status);
export {};
