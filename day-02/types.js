let myname = "Sara";
let age = 25;
let isStudent = true;
let emptyValue = null;
let user = { role: "admin" };
let scores = [90, 85, 88];

console.log(`name "${myname}" ${typeof myname}`);

console.log(`age ${age} ${typeof age}`);

console.log(`isStudent ${isStudent} ${typeof isStudent}`);

console.log(`emptyValue ${emptyValue} ${typeof emptyValue}`);

console.log(`user ${JSON.stringify(user)} ${typeof user}`);

console.log(`scores [${scores.join(", ")}] ${typeof scores}`);

console.log(typeof null);

console.log(typeof []);

console.log(Array.isArray([])); 

const numFromStr = Number("42");
console.log(numFromStr, typeof numFromStr);

const strFromNum = String(42);
console.log(strFromNum, typeof strFromNum);

const invalidNum = Number("hello");
console.log(invalidNum , typeof invalidNum); 

const values = [
  false,
  0,
  -0,
  0n,
  "",
  null,
  undefined,
  NaN,
  [],
  {},
  "0",
  "hello"
];

values.forEach((val) => {
  const status = Boolean(val) ? "truthy" : "falsy";
  console.log(`${String(val)} → ${status}`);
});
