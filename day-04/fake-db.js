/**
 * fake-db.js — Asynchronous Mock Database with 4 Levels
 * Levels: Students -> Courses -> Teachers -> Rooms
 */

const studentsDB = [
  { id: 1, name: "Nour", courseId: 101 },
  { id: 2, name: "Ali", courseId: 102 }
];

const coursesDB = [
  { id: 101, title: "JavaScript Everywhere", teacherId: 201 },
  { id: 102, title: "UI/UX Architecture", teacherId: 202 }
];

const teachersDB = [
  { id: 201, name: "Eng. Mostafa", roomId: 301 },
  { id: 202, name: "Dr. Laila", roomId: 302 }
];

const roomsDB = [
  { id: 301, hall: "Lab A", floor: 2 },
  { id: 302, hall: "Studio B", floor: 3 }
];

// Level 1: Find Student
function findStudent(id, cb) {
  setTimeout(() => {
    const student = studentsDB.find((s) => s.id === id);
    if (!student) return cb(new Error(`Student ID ${id} not found`));
    cb(null, student);
  }, 100);
}

// Level 2: Find Course (dynamic delay based on id)
function findCourse(id, cb) {
  const delay = id === 101 ? 150 : 250;
  setTimeout(() => {
    const course = coursesDB.find((c) => c.id === id);
    if (!course) return cb(new Error(`Course ID ${id} not found`));
    cb(null, course);
  }, delay);
}

// Level 3: Find Teacher
function findTeacher(id, cb) {
  setTimeout(() => {
    const teacher = teachersDB.find((t) => t.id === id);
    if (!teacher) return cb(new Error(`Teacher ID ${id} not found`));
    cb(null, teacher);
  }, 100);
}

// Level 4: Find Room
function findRoom(id, cb) {
  setTimeout(() => {
    const room = roomsDB.find((r) => r.id === id);
    if (!room) return cb(new Error(`Room ID ${id} not found`));
    cb(null, room);
  }, 100);
}

module.exports = { findStudent, findCourse, findTeacher, findRoom };