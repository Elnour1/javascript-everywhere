import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Student, GradedStudent, LetterGrade, GradeTally } from "./types.ts";
import {
  isStudent,
  letterGrade,
  calculateAverage,
  withTimeout,
  retry,
  errorMessage,
  countBy,
  getAttendance,
} from "./lib/index.ts";

async function generateReport(): Promise<void> {
  try {
    const filePath = resolve(process.cwd(), "students.json");
    const rawContent = await withTimeout(readFile(filePath, "utf-8"), 1000);
    const parsed: unknown = JSON.parse(rawContent);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid student data: Expected an array");
    }

    const validStudents: Student[] = [];
    let skippedCount = 0;

    for (const item of parsed) {
      if (isStudent(item)) {
        validStudents.push(item);
      } else {
        skippedCount++;
      }
    }

    // Parallel attendance fetching with retry + Promise.allSettled
    const attendancePromises = validStudents.map((s) =>
      retry(() => getAttendance(s.id), 2)
    );
    const attendanceResults = await Promise.allSettled(attendancePromises);

    const gradedList: GradedStudent[] = validStudents.map((s, idx) => {
      const attRes = attendanceResults[idx];
      const attendance =
        attRes && attRes.status === "fulfilled" ? attRes.value : null;

      const grade = letterGrade(s.score);
      return {
        ...s,
        grade,
        passed: s.score >= 60,
        attendance,
      };
    });

    console.log("=================================================");
    console.log("             TYPED STUDENT GRADE REPORT          ");
    console.log("=================================================");
    console.log("ID   | Name            | Score | Grade | Att.");
    console.log("-----+-----------------+-------+-------+-----");

    for (const st of gradedList) {
      const idCol = String(st.id).padEnd(4);
      const nameCol = st.name.padEnd(15);
      const scoreCol = String(st.score).padEnd(5);
      const gradeCol = st.grade.padEnd(5);
      const attCol = st.attendance !== null ? `${st.attendance}%` : "—";
      console.log(`${idCol} | ${nameCol} | ${scoreCol} | ${gradeCol} | ${attCol}`);
    }

    console.log("-------------------------------------------------");
    const scores = gradedList.map((s) => s.score);
    const avg = calculateAverage(scores);
    const passedTotal = gradedList.filter((s) => s.passed).length;

    const tallyCounts = countBy(gradedList, (s) => s.grade);
    const tally: GradeTally = {
      A: tallyCounts.A ?? 0,
      B: tallyCounts.B ?? 0,
      C: tallyCounts.C ?? 0,
      D: tallyCounts.D ?? 0,
      F: tallyCounts.F ?? 0,
    };

    console.log(`Average Score : ${avg}`);
    console.log(`Passed        : ${passedTotal} / ${gradedList.length}`);
    console.log(`Skipped Records: ${skippedCount}`);
    console.log(`Grade Tally   : A:${tally.A} B:${tally.B} C:${tally.C} D:${tally.D} F:${tally.F}`);
    console.log("=================================================");
  } catch (err) {
    console.error("Report execution error:", errorMessage(err));
  }
}

await generateReport();