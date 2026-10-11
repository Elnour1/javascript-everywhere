const res = await fetch("http://localhost:3000/");
console.log(res.status, res.headers.get("content-type"));
const data = await res.json();
console.log(data);
export {};
