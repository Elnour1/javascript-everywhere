console.log("start");
fetch("http://localhost:3000/api/tasks").then(() => console.log("response"));
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("microtask"));
console.log("end");
