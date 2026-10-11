const res = await fetch("http://localhost:3000/api/tasks/1");
const data = await res.json();
console.log(data.titel.toUpperCase());
