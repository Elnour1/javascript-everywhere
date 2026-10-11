const controller = new AbortController();
controller.abort();
const outcome = await fetch("http://localhost:3000/api/tasks", { signal: controller.signal })
  .then((res) => `status ${res.status}`)
  .catch((err: Error) => err.name);
console.log(outcome);
