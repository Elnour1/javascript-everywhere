const attendanceData = {
  1: '95%',
  2: '92%',
  3: '84%',
  4: '70%',
  5: '89%'
  // Student 99 or unknown will permanently fail
};

// Tracks attempts for student 5 to demonstrate retry recovery
const attemptsCount = new Map();

export default function getAttendance(studentId) {
  const delayMs = ((studentId % 3) + 1) * 35; // Different delay per student

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // الطالب 4 يفشل دائماً لاختبار ظهور '—'
      if (studentId === 4) {
        return reject(new Error(`Attendance system error for student #${studentId}`));
      }

      // الطالب 5 هو Flaky student يفشل أول مرتين وينجح في المحاولة الثالثة
      if (studentId === 5) {
        const currentAttempt = (attemptsCount.get(studentId) || 0) + 1;
        attemptsCount.set(studentId, currentAttempt);

        if (currentAttempt < 3) {
          return reject(new Error(`Temporary network glitch for student #${studentId} (Attempt ${currentAttempt})`));
        }
      }

      const record = attendanceData[studentId];
      if (record) {
        resolve(record);
      } else {
        reject(new Error(`No attendance record found for student #${studentId}`));
      }
    }, delayMs);
  });
}