// ---- Part 1: unpacking ----

// 1
console.log("--- 1 ---");
const { a } = { a: 1, b: 2 };
console.log(a, typeof b);

// 2
console.log("\n--- 2 ---");
try {
  const { x: y } = { x: 10 };
  console.log(x);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}

// 3
console.log("\n--- 3 ---");
const { p = 5 } = { p: undefined };
console.log(p);

// 4
console.log("\n--- 4 ---");
const { q = 5 } = { q: null };
console.log(q);

// 5
console.log("\n--- 5 ---");
const [, , third] = ["a", "b", "c", "d"];
console.log(third);

// 6
console.log("\n--- 6 ---");
const arr = [1, 2];
const copy = arr;
copy.push(3);
console.log(arr.length);

// 7
console.log("\n--- 7 ---");
const obj = { nested: { v: 1 } };
const shallow = { ...obj };
shallow.nested.v = 99;
console.log(obj.nested.v);

// 8
console.log("\n--- 8 ---");
console.log({ ...{ b: 3 }, ...{ a: 1, b: 2 } });

// 9
console.log("\n--- 9 ---");
function f({ a } = {}) { return a; }
console.log(f(), f({ a: 7 }));

// 10
console.log("\n--- 10 ---");
try {
  function g({ a }) { return a; }
  console.log(g());
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}

// 11
console.log("\n--- 11 ---");
try {
  const s = { name: "Sara" };
  console.log(s.address.city);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}

// 12
console.log("\n--- 12 ---");
console.log(0 || "fallback", 0 ?? "fallback");

// ---- Part 2: order ----

// 13
console.log("\n--- 13 ---");
console.log("a");
setTimeout(() => console.log("b"), 0);
console.log("c");

// 14
console.log("\n--- 14 ---");
setTimeout(() => console.log("timeout"), 0);
queueMicrotask(() => console.log("micro"));
console.log("sync");

// 15
console.log("\n--- 15 ---");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("loop var:", i), 0);
}

// 16
console.log("\n--- 16 ---");
function later() {
  setTimeout(() => { return 42; }, 0);
}
console.log("later returned:", later());

// 17
console.log("\n--- 17 ---");
setTimeout(() => console.log("timer"), 0);
const start = Date.now();
while (Date.now() - start < 500) {}
console.log("loop finished");

// 18
console.log("\n--- 18 ---");
setTimeout(() => console.log("outer"), 0);
setTimeout(() => {
  console.log("first");
  setTimeout(() => console.log("nested"), 0);
}, 0);
setTimeout(() => console.log("second"), 0);

// 19
console.log("\n--- 19 ---");
setTimeout(() => {
  console.log("timer");
  queueMicrotask(() => console.log("micro inside timer"));
}, 0);
setTimeout(() => console.log("timer 2"), 0);

// 20
console.log("\n--- 20 ---");
// الخطأ غير المتزامن لا يمكن صيده بواسطة try/catch المتزامن، لذا نسجله كملاحظة توضيحية
console.log("try block executing");
setTimeout(() => {
  // throw new Error("late"); // سيتسبب في إيقاف البرنامج إذا لم يُعلق لأن الخطأ غير متزامن
  console.log("async timer fired (would throw uncaught error in pure runtime)");
}, 0);
console.log("after try");

// 21
console.log("\n--- 21 ---");
function load(cb) {
  cb("sync call");
  setTimeout(() => cb("async call"), 0);
}
load((msg) => console.log(msg));
console.log("after load");

// 22
console.log("\n--- 22 ---");
setTimeout(() => console.log("A"), 20);
setTimeout(() => console.log("B"), 10);
queueMicrotask(() => console.log("C"));
console.log("D");