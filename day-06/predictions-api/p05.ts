const pending = fetch("http://localhost:3000/api/tasks");
console.log(pending instanceof Promise);
const res = await pending;
console.log(typeof res.json, Array.isArray(res));
