// ==========================================
// 5.1 — db-types.ts — The Shapes
// ==========================================

// Base entity interface
export interface BaseEntity {
  readonly id: number;
}

// 1. Literal union property
export type Track = "Frontend" | "Backend" | "Fullstack";
export type SubmissionStatus = "submitted" | "graded" | "late";

// Table 1: Students (Extends BaseEntity)
export interface StudentRecord extends BaseEntity {
  name: string;
  email: string;
  phone?: string; // Optional property 1
  track: Track;
}

// Table 2: Courses (Extends BaseEntity)
export interface CourseRecord extends BaseEntity {
  title: string;
  creditHours: number;
  description?: string; // Optional property 2
}

// Table 3: Enrollments (Extends BaseEntity)
export interface EnrollmentRecord extends BaseEntity {
  studentId: number;
  courseId: number;
  enrolledAt: string;
}

// Table 4: Grades (Extends BaseEntity)
export interface GradeRecord extends BaseEntity {
  enrollmentId: number;
  score: number;
  status: SubmissionStatus;
}

// Shape built with & (Intersection type)
export type StudentWithDetails = StudentRecord & {
  completedCoursesCount: number;
};

// Interface for the final built report
export interface StudentGradeReport {
  studentId: number;
  name: string;
  track: Track;
  courseTitle: string;
  score: number;
  status: SubmissionStatus;
}