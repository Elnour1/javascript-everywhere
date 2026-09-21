
function celsiusToF_decl(c) {
  return (c * 9) / 5 + 32;
}

const celsiusToF_expr = function (c) {
  return (c * 9) / 5 + 32;
};

const celsiusToF_arrow = (c) => (c * 9) / 5 + 32;

console.log("Declaration:", celsiusToF_decl(25)); // 77
console.log("Expression: ", celsiusToF_expr(25)); // 77
console.log("Arrow:      ", celsiusToF_arrow(25)); // 77

function addLog(a, b) {
  console.log(a + b);
}

function addReturn(a, b) {
  return a + b;
}

const doubledFromLog = addLog(5, 5) * 2;
console.log("Doubled from Log:", doubledFromLog); // NaN

const doubledFromReturn = addReturn(5, 5) * 2;
console.log("Doubled from Return:", doubledFromReturn); // 20

const greet = (name = "guest", greeting = "Hello") => `${greeting}, ${name}!`;

console.log(greet()); // No arguments -> Hello, guest!
console.log(greet("Nour")); // One argument -> Hello, Nour!
console.log(greet("Nour", "Welcome")); // Both arguments -> Welcome, Nour!
console.log(greet(undefined, "Hi")); // undefined triggers default -> Hi, guest!

console.log(greet(null, "Hey")); // Hey, null!

function sumAll(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

console.log("Sum 0 args:", sumAll()); // 0
console.log("Sum 1 arg: ", sumAll(10)); // 10
console.log("Sum 5 args:", sumAll(1, 2, 3, 4, 5)); // 15

function describe(label, ...values) {
  return `${label}: ${values.join(", ")}`;
}

console.log(describe("Scores", 98, 85, 91)); // Scores: 98, 85, 91


function safeDivide(a, b) {
  // Guard clause 1: Check if arguments are numbers
  if (typeof a !== "number" || typeof b !== "number" || Number.isNaN(a) || Number.isNaN(b)) {
    return "Error: Both arguments must be valid numbers";
  }

  // Guard clause 2: Check divide-by-zero
  if (b === 0) {
    return "Error: Cannot divide by zero";
  }

  return a / b;
}

console.log("Valid division:   ", safeDivide(10, 2)); // 5
console.log("Divide by zero:   ", safeDivide(10, 0)); // Error: Cannot divide by zero
console.log("Non-number inputs:", safeDivide(10, "two")); // Error: Both arguments must be valid numbers