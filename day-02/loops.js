for (let i = 1; i <= 20; i++) {
  if (i % 3 === 0) {
    console.log("Fizz");
  } else {
    console.log(i);
  }
}

const tracks = [
  "Track One",
  "Track Two",
  "Track Three",
  "Track Four",
  "Track Five",
  "Track Six"
];

let position = 1;
for (const track of tracks) {
  console.log(`Position ${position}: ${track}`);
  position++;
}

const userProfile = {
  id: 101,
  username: "ahmed99",
  email: "ahmed@example.com",
  role: "developer",
  isActive: true
};

for (const key in userProfile) {
  console.log(`${key}: ${userProfile[key]}`);
}

let currentVal = 100;

while (currentVal >= 1) {
  console.log(`Current value: ${currentVal}`);
  currentVal /= 2;
}

let isReady = false;

do {
  console.log("This line runs exactly once, even though isReady is false!");
} while (isReady);

const testScores = [45, 60, 72, 30, 88, 96, 55, 90];

for (const score of testScores) {
  if (score < 50) {
    continue; 
  }
  if (score > 95) {
    break;
  }
  console.log(`Score processed: ${score}`);
}

const numbers = [14, 28, 5, 82, 43, 91, 3, 67];
let sum = 0;
let highest = numbers[0];
let lowest = numbers[0];

for (let i = 0; i < numbers.length; i++) {
  const current = numbers[i];


  sum += current;
  if (current > highest) {
    highest = current;
  }

  if (current < lowest) {
    lowest = current;
  }
}

const average = sum / numbers.length;

console.log(`Array: [${numbers.join(", ")}]`);
console.log(`Sum: ${sum}`);
console.log(`Average: ${average}`);
console.log(`Highest: ${highest}`);
console.log(`Lowest: ${lowest}`);