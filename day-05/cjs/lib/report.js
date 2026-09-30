// 6.1: تحميل JSON مباشرة و Destructuring للوحدات
const students = require('./students.json');
const { formatRow, average } = require('./lib/grade-lib');
const gradeLib = require('./lib/grade-lib');
const delay = require('./lib/delay');
const counter = require('./lib/counter');

async function run() {
  console.log('--- 6.1: REPORT & PRIVATE HELPER ---');
  
  // إثبات أن المساعد الخاص غير موجود
  console.log('Can report.js see roundScore?', gradeLib.roundScore === undefined); // true

  students.forEach((s) => console.log(formatRow(s.name, s.score)));
  const avg = average(students.map((s) => s.score));
  console.log(`Class Average: ${avg}`);

  await delay(100);

  console.log('\n--- 6.2: CACHE VERIFICATION ---');
  console.log('Counter in report.js before increment:', counter.getCount()); // 0
  counter.increment();
  console.log('Counter in report.js after increment:', counter.getCount()); // 1

  // استدعاء ملف آخر يتحقق من نفس الـ Cache
  require('./other.js');
}

run();