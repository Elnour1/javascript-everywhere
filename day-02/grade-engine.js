const score = [100,90,80,70,60];

function getGrade(score) {
  if (score >= 90 && score <= 100) {
    return "A";
  } else if (score >= 80 && score <= 89) {
    return "B";
  } else if (score >= 70 && score <= 79) {
    return "C";
  } else if (score >= 60 && score <= 69) {
    return "D";
  } else {
    return "below 60";
  }
}

console.log("Score 95 ", getGrade(95 ,"A")); 
console.log("Score 85 ", getGrade(85 ,"B"));
console.log("Score 75 ", getGrade(75,"C")); 
console.log("Score 65 ", getGrade(65,"D")); 
console.log("Score 45 ", getGrade(45,"below 60"));
console.log("Score 105 ", getGrade(105,"below 60"));
console.log("Score -5  ", getGrade(-5,"below 60")); 

const testScore = 75;
const result = testScore >= 60 ? "pass" : "fail";
console.log(`Score ${testScore} result:`, result);

function evaluateGrade(grade) {
  switch (grade) {
    case "A":
      console.log("Grade A (90-100): Excellent job!");
      break;
    case "B":
      console.log("Grade B (80-89): Good work!");
      break;
    case "C":
      console.log("Grade C (70-79): Satisfactory performance.");
      break;
    case "D":
      console.log("Grade D (60-69): Needs improvement.");
      break;
    case "F":
      console.log("Grade F (below 60): Failed.");
      break;
    default:
      console.log("Invalid grade letter.");
  }
}

function checkStudentStatus(score, attendance) {
  if (score >= 70 && attendance >= 80) {
    console.log(`Score: ${score}, Attendance: ${attendance}% → Certificate awarded`);
  } else if (score < 60 || attendance < 50) {
    console.log(`Score: ${score}, Attendance: ${attendance}% → Review needed`);
  } else {
    console.log(`Score: ${score}, Attendance: ${attendance}% → Standard progress`);
  }
}

checkStudentStatus(85, 90); 
checkStudentStatus(75, 75); 
checkStudentStatus(55, 85);
checkStudentStatus(70, 45);