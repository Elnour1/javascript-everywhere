// const myName = "Nour";
// //myName = "javascript"; // This will throw an error because myName is a constant and cannot be reassigned.

// const student = {
//     favoriteLanguage: "JavaScript",
// };
// console.log(student.favoriteLanguage); 

// let score = 95;
// if (score >= 50) {
//   console.log("Passed!");
// } else {
//   console.log("Failed!");
// }

// const tracks = ["Frontend", "Backend", "Mobile", "UI/UX", "Data Science"];
// for (let i = 0; i < tracks.length; i++) {
//   if (tracks[i].length > 6) {
//     console.log(tracks[i]);
//   }
// }
const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 }
];

let passedCount = 0;

for (let i = 0; i < students.length; i++) {
  const student = students[i];

  if (student.score >= 70) {
    console.log(`${student.name}: ${student.score} → PASS`);
    passedCount++;
  } else {
    console.log(`${student.name}: ${student.score} → FAIL`);
  }
}
console.log(`${passedCount} of ${students.length} students passed.`);
