// 1
console.log(a);
var a = 1;

// 2
try {
  console.log(b);
  let b = 2;
} catch (err) {
  console.log(err.name + ": " + err.message);
}

// 3
hello();
function hello() { console.log("hi"); }

// 4
try {
  bye();
  const bye = () => console.log("bye");
} catch (err) {
  console.log(err.name + ": " + err.message);
}

// 5
function f() { return; 42; }
console.log(f());

// 6
const g = (x) => { x * 2 };
console.log(g(5));

// 7
const h = (x) => { value: x };
console.log(h(5));

// 8
function k(a, b) { return a + b; }
console.log(k(1));

// 9
function m(x = 10) { return x; }
console.log(m(null), m(undefined), m(0));

// 10
let n = "outer";
function p() { let n = "inner"; return n; }
console.log(p(), n);

// 11
for (var i = 0; i < 3; i++) {}
console.log(i);

// 12
try {
  for (let j = 0; j < 3; j++) {}
  console.log(j);
} catch (err) {
  console.log(err.name + ": " + err.message);
}

// 13
function counter() { let c = 0; return () => ++c; }
const q = counter();
console.log(q(), q(), counter()());

// 14
const nums = [1, 2, 3];
console.log(nums.map((x) => x * 2));

// 15
function r() { console.log("ran"); }
console.log(r);