const classA = [85, 92, 78, 90, 88];
classA.forEach((grade) => {
  console.log(`Grade: ${grade}`);
});

const classB = [82, 98, 74, 91];
const allGrades = [...classA, ...classB];

let highestScore = allGrades[0];

for (let i = 1; i < allGrades.length; i++) {
  if (allGrades[i] > highestScore) {
    highestScore = allGrades[i];
  }
}

console.log("Highest score across both classes:", highestScore);