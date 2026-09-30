
const tables = {
  students: {
    1: { id: 1, name: 'Tariq', courseId: 101 },
    2: { id: 2, name: 'Omar', courseId: 101 },
    3: { id: 3, name: 'Laila', courseId: 101 }
  },
  courses: { 101: { id: 101, title: 'CS101', teacherId: 201 } },
  teachers: { 201: { id: 201, name: 'Dr. Sarah', room: 'B-12' } },
  grades: {
    1: { studentId: 1, grade: 'A+' },
    2: { studentId: 2, grade: 'B' },
    3: { studentId: 3, grade: 'A' }
  }
};

function queryTable(tableName, id) {
  // Retaining Day 04 behavior: different delay per id
  const delayMs = ((id % 3) + 1) * 40; // 40ms, 80ms, 120ms
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

// ==========================================================
// 5.1: Rewrite
// ==========================================================
// Rewriting buildReport: no .then, all intermediate values are plain `const`
async function buildReport(studentId) {
  const student = await getStudent(studentId);
  const course = await getCourse(student.courseId);
  const teacher = await getTeacher(course.teacherId);
  const grade = await getGrade(student.id);

  return `REPORT: Student ${student.name} earned grade ${grade.grade} in ${course.title} taught by ${teacher.name} (Room: ${teacher.room}).`;
}

// ==========================================================
// 5.2: Sequential vs Parallel
// ==========================================================
async function demonstrateSequentialVsParallel() {
  console.log('\n--- PART 5.2: SEQUENTIAL VS PARALLEL ---');
  const ids = [1, 2, 3];

  // 1. Sequential with for...of + await
  const startSeq = Date.now();
  const seqResults = [];
  for (const id of ids) {
    const student = await getStudent(id);
    seqResults.push(student.name);
  }
  const seqDuration = Date.now() - startSeq;
  console.log(`Sequential loaded [${seqResults.join(', ')}] in ${seqDuration}ms`);

  // 2. Parallel with Promise.all + map
  const startPar = Date.now();
  const parResults = await Promise.all(ids.map(async (id) => {
    const student = await getStudent(id);
    return student.name;
  }));
  const parDuration = Date.now() - startPar;
  console.log(`Parallel loaded [${parResults.join(', ')}] in ${parDuration}ms`);

 
}

// ==========================================================
// 5.3: The forEach Trap
// ==========================================================
async function demonstrateForEachTrap() {
  console.log('\n--- PART 5.3: THE FOREACH TRAP ---');
  const ids = [1, 2, 3];

  // The Trap: Array.prototype.forEach does NOT await promises returned by its callback
  console.log('1. Demonstrating the trap:');
  ids.forEach(async (id) => {
    const student = await getStudent(id);
    console.log(`  [forEach inside] Loaded ${student.name}`);
  });
  console.log('  [forEach outside] "done" prints FIRST before callbacks finish!');

  // Small delay so trap logs finish before running fixes
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Fix 1: for...of (sequential await)
  console.log('2. Fixed with for...of:');
  for (const id of ids) {
    const student = await getStudent(id);
    console.log(`  [for...of] Loaded ${student.name}`);
  }
  console.log('  [for...of] "done" correctly prints AFTER all finish.');

  // Fix 2: Promise.all + map (concurrent await)
  console.log('3. Fixed with Promise.all + map:');
  await Promise.all(
    ids.map(async (id) => {
      const student = await getStudent(id);
      console.log(`  [Promise.all] Loaded ${student.name}`);
    })
  );
  console.log('  [Promise.all] "done" correctly prints AFTER all finish.');
}

async function riskyOperation() {
  throw new Error('Something exploded in riskyOperation!');
}

async function returnWithoutAwait() {
  try {
    // BUG: Returns the pending Promise directly. When it rejects,
    // the surrounding try/catch has already exited synchronously!
    return riskyOperation();
  } catch (err) {
    return `CAUGHT LOCALLY (without await): ${err.message}`;
  }
}

async function returnWithAwait() {
  try {
    // FIX: Pauses execution until the Promise settles.
    // If it rejects, the error is thrown inside this frame and caught!
    return await riskyOperation();
  } catch (err) {
    return `CAUGHT LOCALLY (with await): ${err.message}`;
  }
}

async function demonstrateReturnAwait() {
  console.log('\n--- PART 5.4: RETURN AWAIT ---');

  // 1. Without await: local catch never runs, error bubbles to caller
  try {
    const res = await returnWithoutAwait();
    console.log('Result without await:', res);
  } catch (err) {
    console.log('Caller caught unhandled rejection from returnWithoutAwait:', err.message);
  }

  // 2. With await: local catch intercepts the error
  const handledLocally = await returnWithAwait();
  console.log('Result with await:', handledLocally);
}

async function main() {
  console.log('--- PART 5.1: REWRITE & RAW PROMISE ---');

  // Logging buildReport(1) without await (yields Promise { <pending> })
  const unawaited = buildReport(1);
  console.log('Unawaited call returns:', unawaited);

  console.log('\nExecuting good ID:');
  try {
    const report = await buildReport(1);
    console.log(report);
  } catch (err) {
    console.error('Error with good ID:', err.message);
  } finally {
    console.log('[Cleanup] Completed good ID run.');
  }

  console.log('\nExecuting bad ID:');
  try {
    const badReport = await buildReport(999);
    console.log(badReport);
  } catch (err) {
    console.error('Caught expected failure:', err.message);
  } finally {
    console.log('[Cleanup] Completed bad ID run.');
  }

  // Run subsequent sections
  await demonstrateSequentialVsParallel();
  await demonstrateForEachTrap();
  await demonstrateReturnAwait();
}

// Called at the bottom of the file
main().catch((fatal) => {
  console.error('Fatal crash in main():', fatal);
})