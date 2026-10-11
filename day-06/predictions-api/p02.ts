try {
  const res = await fetch("http://localhost:3000/api/tasks/999");
  console.log("no throw", res.status);
} catch {
  console.log("threw");
}
