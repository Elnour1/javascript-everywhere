

const globalVar = "I am Global";

function testLevels() {
  const functionVar = "I am Function-Scoped";

  if (true) {
    const blockVar = "I am Block-Scoped";
    console.log(globalVar);
    console.log(functionVar);
    console.log(blockVar);
  }
}

testLevels();

if (true) {
  var leakedVar = "var: I escaped the block!";
  let safeLet = "let: I stay inside";
}

console.log(leakedVar); // Prints successfully because var ignores block boundaries.

let status = "Global Status";

function updateStatus() {
  let status = "Local Status";
  console.log("Inside function:", status); // Wins: Local Status
}

updateStatus();
console.log("Outside function:", status); // Untouched: Global Status

sayHello(); // Output: "Hello from hoisted declaration"
function sayHello() {
  console.log("Hello from hoisted declaration");
}

console.log("var before initialization:", hoistedVar); // Output: undefined
var hoistedVar = 42;

let hoistedLet = 100;
const sayBye = () => console.log("Bye");

// 1. Using var
const varFns = [];
for (var i = 0; i < 3; i++) {
  varFns.push(() => i);
}

console.log("var results:");
varFns.forEach((f) => console.log(f())); // Prints: 3, 3, 3

// 2. Using let
const letFns = [];
for (let j = 0; j < 3; j++) {
  letFns.push(() => j);
}

console.log("let results:");
letFns.forEach((f) => console.log(f())); // Prints: 0, 1, 2
