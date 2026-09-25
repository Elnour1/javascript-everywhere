/**
 * hell.js — Building the Pyramid of Doom deliberately
 */

const { findStudent, findCourse, findTeacher, findRoom } = require("./fake-db");

console.log("=== Running Callback Hell (Pyramid) ===");

function fetchReportHell(studentId) {
  // Level 1
  findStudent(studentId, (err1, student) => {
    if (err1) return console.error("[Error Level 1]:", err1.message);

    // Level 2
    findCourse(student.courseId, (err2, course) => {
      if (err2) return console.error("[Error Level 2]:", err2.message);

      // Level 3
      findTeacher(course.teacherId, (err3, teacher) => {
        if (err3) return console.error("[Error Level 3]:", err3.message);

        // Level 4 (Deepest indentation)
        findRoom(teacher.roomId, (err4, room) => {
          if (err4) return console.error("[Error Level 4]:", err4.message);

          // Deepest line indentation depth: 10 spaces / 5 nesting levels
          console.log(
            `Report: ${student.name} is enrolled in "${course.title}", taught by ${teacher.name} in ${room.hall} (Floor ${room.floor}).`
          );
        });
      });
    });
  });
}

// Success Path:
fetchReportHell(1);

// Breaking Path 1: Bad Student ID
// fetchReportHell(999);

// Breaking Path 2: (Tested by passing a bad courseId in DB)
// Breaking Path 3: (Tested by passing a bad teacherId in DB)