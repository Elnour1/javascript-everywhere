console.log('[grade-lib.js] Loaded into memory!'); // لإثبات الـ Cache في 6.2

// دالة خاصة (Private Helper) - لا يتم تصديرها
function roundScore(score) {
  return Math.round(score);
}

function letterGrade(score) {
  const rounded = roundScore(score);
  if (rounded >= 90) return 'A';
  if (rounded >= 80) return 'B';
  if (rounded >= 70) return 'C';
  return 'F';
}

function average(scores) {
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return roundScore(sum / scores.length);
}

function formatRow(name, score) {
  return `${name.padEnd(10)} | ${String(score).padStart(3)} | ${letterGrade(score)}`;
}

// التصدير الجماعي الرسمي لـ CJS
module.exports = {
  letterGrade,
  average,
  formatRow
};