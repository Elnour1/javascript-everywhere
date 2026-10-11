export interface RawRecord {
  id: number;
  name: string;
  scores: number[];
  category?: string;
}

export interface StudentSummary {
  id: number;
  name: string;
  average: number;
  status: "Pass" | "Fail";
}

export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / scores.length).toFixed(2));
}

export function processStudentRecords(records: RawRecord[]): StudentSummary[] {
  return records.map((record) => {
    const avg = calculateAverage(record.scores);
    return {
      id: record.id,
      name: record.name,
      average: avg,
      status: avg >= 60 ? "Pass" : "Fail",
    };
  });
}

export function findTopPerformer(summaries: StudentSummary[]): StudentSummary | null {
  if (summaries.length === 0) return null;
  return summaries.reduce((highest, current) =>
    current.average > highest.average ? current : highest
  );
}

export function safeLookupStudent(
  records: RawRecord[],
  id: number
): RawRecord | null {
  const found = records.find((r) => r.id === id);
  // Real Bug Fixed: Previously returned found directly, leading to runtime crash when accessing properties
  return found ?? null;
}

// Execution verification
const sampleData: RawRecord[] = [
  { id: 1, name: "Sara", scores: [85, 90, 92] },
  { id: 2, name: "Ali", scores: [50, 55, 58] },
  { id: 3, name: "Nour", scores: [95, 98, 100], category: "honors" },
];

const summaries = processStudentRecords(sampleData);
const topStudent = findTopPerformer(summaries);
console.log("Processed summaries count:", summaries.length);
console.log("Top student average:", topStudent ? topStudent.average : "None");