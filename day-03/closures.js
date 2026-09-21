
function makeCounter() {
  let count = 0; // Private variable encapsulated in lexical scope
  return function () {
    count++;
    return count;
  };
}

const counterA = makeCounter();
const counterB = makeCounter();

console.log("Counter A:", counterA()); // 1
console.log("Counter A:", counterA()); // 2
console.log("Counter B (independent):", counterB()); // 1
console.log("Counter A continues:   ", counterA()); // 3

function makeMultiplier(factor) {
  return (num) => num * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const half = makeMultiplier(0.5);

console.log("Double 10: ", double(10)); // 20
console.log("Triple 10: ", triple(10)); // 30
console.log("Half 10:   ", half(10)); // 5

function makeGrader(passMark) {
  return function (score) {
    return score >= passMark ? "Pass" : "Fail";
  };
}

const strictGrader = makeGrader(85);
const lenientGrader = makeGrader(60);

const testScore = 75;
console.log(`Score ${testScore} on Strict (85): `, strictGrader(testScore)); // Fail
console.log(`Score ${testScore} on Lenient (60):`, lenientGrader(testScore)); // Pass

function myForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i);
  }
}

const tracks = ["Web", "Mobile", "DevOps"];
myForEach(tracks, (item, index) => {
  console.log(`${index + 1}. ${item}`);
});

function myMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

function myFilter(array, test) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (test(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

const rawScores = [45, 88, 62, 95, 53, 79];

// Transform scores:
const curvedScores = myMap(rawScores, (score) => score + 5);
console.log("Original scores (unmodified):", rawScores);
console.log("Curved scores:               ", curvedScores);

// Filter scores (passMark = 60):
const passingScores = myFilter(rawScores, (score) => score >= 60);
console.log("Passing scores only:         ", passingScores);

function runTwice(fn) {
  if (typeof fn !== "function") {
    throw new TypeError(`Expected a function, got ${typeof fn}`);
  }
  fn();
  fn();
}

function sayHi() {
  console.log("Hi!");
}

console.log("Passing reference correctly:");
runTwice(sayHi);

console.log("\nDeliberately calling runTwice(sayHi()):");
try {
  runTwice(sayHi());
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}