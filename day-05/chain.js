
const tables = {
  students: { 1: { id: 1, name: 'Tariq', courseId: 101 } },
  courses: { 101: { id: 101, title: 'CS101', teacherId: 201 } },
  teachers: { 201: { id: 201, name: 'Dr. Sarah', room: 'B-12' } },
  grades: { 1: { studentId: 1, grade: 'A+' } }
};

function queryTable(tableName, id) {
  const delayMs = (id % 3 + 1) * 30;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = tables[tableName]?.[id];
      if (record) {
        resolve(record);
      } else {
        reject(new Error(`[${tableName}] Record with id ${id} not found`));
      }
    }, delayMs);
  });
}

const getStudent = (id) => queryTable('students', id);
const getCourse = (id) => queryTable('courses', id);
const getTeacher = (id) => queryTable('teachers', id);
const getGrade = (id) => queryTable('grades', id);

function buildReport(studentId) {
  const startTime = Date.now();
  const reportData = {};

  return getStudent(studentId)
    .then((student) => {
      reportData.student = student;
      return getCourse(student.courseId);
    })
    .then((course) => {
      reportData.course = course;
      return getTeacher(course.teacherId);
    })
    .then((teacher) => {
      reportData.teacher = teacher;
      return getGrade(reportData.student.id);
    })
    .then((grade) => {
      reportData.grade = grade;
      // Printed one line using data from every level with a template literal
      console.log(
        `REPORT: Student ${reportData.student.name} earned grade ${reportData.grade.grade} in ${reportData.course.title} taught by ${reportData.teacher.name} (Room: ${reportData.teacher.room}).`
      );
    })
    .catch((err) => {
      console.error(`Pipeline Failed: ${err.message}`);
    })
    .finally(() => {
      const duration = Date.now() - startTime;
      console.log(`[Timer] Chain completed in ${duration}ms\n`);
    });
}

async function runDemos() {
  console.log('=== 1. SUCCESS RUN ===');
  await buildReport(1);

  console.log('=== 2. BROKEN STUDENT ID ===');
  await buildReport(999);

  console.log('=== 3. BROKEN COURSE ID ===');
  // Temporarily point student to a non-existent course to test mid-chain break
  tables.students[2] = { id: 2, name: 'Omar', courseId: 999 };
  await buildReport(2);

  console.log('=== 4. BROKEN TEACHER ID ===');
  // Course pointing to non-existent teacher
  tables.students[3] = { id: 3, name: 'Laila', courseId: 102 };
  tables.courses[102] = { id: 102, title: 'MATH201', teacherId: 888 };
  await buildReport(3);
}

runDemos();