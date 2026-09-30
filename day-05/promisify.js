import util from 'util';

// ==========================================================
// Day 04 fake-db.js (Callback style - Unchanged)
// ==========================================================
const db = {
  students: { 1: { id: 1, name: 'Tariq', courseId: 101 } },
  courses: { 101: { id: 101, title: 'CS101', teacherId: 201 } },
  teachers: { 201: { id: 201, name: 'Dr. Sarah', room: 'B-12' } },
  grades: { 1: { studentId: 1, grade: 'A+' } } // The 4th custom level
};

function getStudent(id, cb) {
  setTimeout(() => {
    const item = db.students[id];
    item ? cb(null, item) : cb(new Error(`Student with id ${id} not found`));
  }, 50);
}

function getCourse(id, cb) {
  setTimeout(() => {
    const item = db.courses[id];
    item ? cb(null, item) : cb(new Error(`Course with id ${id} not found`));
  }, 50);
}

function getTeacher(id, cb) {
  setTimeout(() => {
    const item = db.teachers[id];
    item ? cb(null, item) : cb(new Error(`Teacher with id ${id} not found`));
  }, 50);
}

function getGrade(id, cb) {
  setTimeout(() => {
    const item = db.grades[id];
    item ? cb(null, item) : cb(new Error(`Grade with id ${id} not found`));
  }, 50);
}

// ==========================================================
// 1. Wrap getStudent by hand
// ==========================================================
const getStudentPromise = (id) => {
  return new Promise((resolve, reject) => {
    getStudent(id, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

// ==========================================================
// 2. Custom promisify(fn) using closures and ...args
// ==========================================================
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

const getCoursePromise = promisify(getCourse);
const getTeacherPromise = promisify(getTeacher);
const getGradePromise = promisify(getGrade);

// ==========================================================
// 3. Wrap with Node's util.promisify to verify identical behavior
// ==========================================================
const getCourseUtilPromise = util.promisify(getCourse);

// ==========================================================
// Verification & Execution (Good IDs vs Bad IDs)
// ==========================================================
async function testWrappers() {
  console.log('--- Testing Hand-wrapped getStudent ---');
  await getStudentPromise(1).then((res) => console.log('Good ID:', res)).catch(console.error);
  await getStudentPromise(99).then(console.log).catch((err) => console.log('Bad ID:', err.message));

  console.log('\n--- Testing Custom promisify vs util.promisify ---');
  await getCoursePromise(101).then((res) => console.log('Custom promisify (Good):', res.title));
  await getCourseUtilPromise(101).then((res) => console.log('util.promisify (Good):', res.title));

  console.log('\n--- Testing Other Tables with Good and Bad IDs ---');
  await getTeacherPromise(201).then((res) => console.log('Teacher Good:', res.name));
  await getTeacherPromise(999).catch((err) => console.log('Teacher Bad:', err.message));

  await getGradePromise(1).then((res) => console.log('Grade Good:', res.grade));
  await getGradePromise(999).catch((err) => console.log('Grade Bad:', err.message));
}

testWrappers();