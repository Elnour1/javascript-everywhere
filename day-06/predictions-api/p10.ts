const res = await fetch("http://localhost:3000/");
console.log(res.status, res.headers.get("content-type"));
const data: unknown = await res.json();
console.log(data);
