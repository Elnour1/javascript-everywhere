import fs from 'node:fs/promises';
import {
  isValidStudent,
  withBonus,
  formatRow,
  average,
  getTally,
  withTimeout,
  retry,
  getAttendance
} from './lib/index.js';

console.log('Loading...');
const startTime = Date.now();

try {
  // 1. Reading file safely with import.meta.url & timeout
  const jsonPath = new URL('./students.json', import.meta.url);
  const rawData = await withTimeout(fs.readFile(jsonPath, 'utf-8'), 2000);
  const parsedData = JSON.parse(rawData);

  // 2. Validate students and separate invalid ones
  const validStudents = [];
  let invalidCount = 0;

  for (const item of parsedData) {
    if (isValidStudent(item)) {
      validStudents.push(item);
    } else {
      invalidCount++;
    }
  }

  // 3. Demonstrate withBonus immutability on valid students (Optional curve: +2 pts)
  const processedStudents = validStudents.map((s) => withBonus(s, 2));

  // 4. Fetch attendance concurrently with Promise.allSettled and retry
  const attendanceResults = await Promise.allSettled(
    processedStudents.map((student) =>
      retry(() => getAttendance(student.id), 3, 40)
    )
  );

  // Combine student data with resolved attendance
  const studentsWithAttendance = processedStudents.map((student, idx) => {
    const outcome = attendanceResults[idx];
    const attendance = outcome.status === 'fulfilled' ? outcome.value : '—';
    return { ...student, attendance };
  });

  // 5. Output in original required order
  console.log('\n================ GRADE REPORT ================');
  console.log(`${'Name'.padEnd(14)} | Score | Gr | Attendance`);
  console.log('----------------------------------------------');

  studentsWithAttendance.forEach((s) => {
    console.log(formatRow(s.name, s.score, s.attendance));
  });

  console.log('----------------------------------------------');
  const scores = studentsWithAttendance.map((s) => s.score);
  console.log(`Class Average : ${average(scores)}`);
  console.log(`Skipped Rows  : ${invalidCount} invalid record(s)`);

  const tally = getTally(scores);
  console.log(`Grade Tally   : A:${tally.A} | B:${tally.B} | C:${tally.C} | D:${tally.D} | F:${tally.F}`);
  console.log('==============================================\n');

} catch (err) {
  // Single handler for file missing, JSON parsing syntax errors, or load timeouts
  console.error(`\n[Fatal Report Error]: ${err.message}`);
} finally {
  const duration = Date.now() - startTime;
  console.log(`Total execution time: ${duration}ms`);
}