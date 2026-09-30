// استدعاء نفس الملفات لإثبات عدم إعادة التنفيذ ومشاركة الحالة
const gradeLib = require('./lib/grade-lib');
const counter = require('./lib/counter');

console.log('[other.js] Required grade-lib again (notice no second log from grade-lib)');
console.log('[other.js] Shared Counter value:', counter.getCount()); // 1
counter.increment();
console.log('[other.js] Counter incremented to:', counter.getCount()); // 2