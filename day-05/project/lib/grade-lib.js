export function roundScore(score) {
  return Math.round(score);
}

export function letterGrade(score) {
  const rounded = roundScore(score);
  if (rounded >= 90) return 'A';
  if (rounded >= 80) return 'B';
  if (rounded >= 70) return 'C';
  if (rounded >= 60) return 'D';
  return 'F';
}

export function average(scores) {
  if (!scores.length) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return roundScore(sum / scores.length);
}

export function isValidStudent(student) {
  return (
    typeof student === 'object' &&
    student !== null &&
    typeof student.id === 'number' &&
    typeof student.name === 'string' &&
    typeof student.score === 'number' &&
    !isNaN(student.score)
  );
}

export function withBonus(student, bonusPoints) {
  // Pure function: returns a new copy to prove no mutation
  return {
    ...student,
    score: Math.min(100, student.score + bonusPoints)
  };
}

export function formatRow(name, score, attendance = '—') {
  const grade = letterGrade(score);
  return `${name.padEnd(14)} | ${String(score).padStart(3)} | ${grade.padEnd(2)} | ${String(attendance).padStart(10)}`;
}

export function getTally(scores) {
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const score of scores) {
    const grade = letterGrade(score);
    if (counts[grade] !== undefined) {
      counts[grade]++;
    }
  }
  return counts;
}