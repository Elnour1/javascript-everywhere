const attendanceDb: Record<number, number> = {
  1: 95,
  2: 88,
  3: 40,
  // Student 6 will fail
};

export async function getAttendance(id: number): Promise<number> {
  await new Promise((r) => setTimeout(r, 20));
  const rate = attendanceDb[id];
  if (rate === undefined) {
    throw new Error(`Attendance not found for student ${id}`);
  }
  return rate;
}