
const tables = {
  students: { 1: { id: 1, name: 'Tariq', courseId: 101 } },
  courses: { 101: { id: 101, title: 'CS101', teacherId: 201 } },
  teachers: { 201: { id: 201, name: 'Dr. Sarah', room: 'B-12' } },
  grades: { 1: { studentId: 1, grade: 'A+' } }
};

// Shared helper: eliminates duplicating new Promise() across all operations
function queryTable(tableName, id) {
  // Retaining Day 04 behavior: different delay per id to simulate real latency
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

export const getStudent = (id) => queryTable('students', id);
export const getCourse = (id) => queryTable('courses', id);
export const getTeacher = (id) => queryTable('teachers', id);
export const getGrade = (id) => queryTable('grades', id);