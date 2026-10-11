// ==========================================
// 7.1 — A Class
// ==========================================

// 1. Interface with at least one readonly property and two methods:
export interface ICourse {
  readonly id: number;
  title: string;
  creditHours: number;
  getSummary(): string;
  updateCreditHours(hours: number): this;
}

// 2. Class implementing the interface:
export class Course implements ICourse {
  // Static counter
  static instanceCount = 0;

  // Fields declared and typed before the constructor
  readonly id: number;
  title: string;
  creditHours: number;
  #enrolledCount: number; // #private field

  constructor(id: number, title: string, creditHours: number) {
    this.id = id;
    this.title = title;
    this.creditHours = creditHours;
    this.#enrolledCount = 0;
    Course.instanceCount++;
  }

  // Getter for the private field
  get enrolledCount(): number {
    return this.#enrolledCount;
  }

  // Method validating input and throwing on bad data
  enrollStudents(count: number): void {
    if (count <= 0 || !Number.isInteger(count)) {
      throw new Error(`Invalid student count: ${count}. Must be a positive integer.`);
    }
    this.#enrolledCount += count;
  }

  getSummary(): string {
    return `[#${this.id}] ${this.title} (${this.creditHours} cr) - Enrolled: ${this.#enrolledCount}`;
  }

  // Method returning 'this' for chaining
  updateCreditHours(hours: number): this {
    if (hours < 1 || hours > 6) {
      throw new Error("Credit hours must be between 1 and 6.");
    }
    this.creditHours = hours;
    return this;
  }

  setTitle(newTitle: string): this {
    this.title = newTitle;
    return this;
  }
}

// Method returning this & chain of three calls:
const tsCourse = new Course(101, "TypeScript Basics", 2);
tsCourse.setTitle("TypeScript Mastery").updateCreditHours(3).setTitle("Advanced TypeScript");
tsCourse.enrollStudents(25);
console.log(tsCourse.getSummary());
console.log("Static Course count:", Course.instanceCount);

// ==========================================
// 7.2 — Inheritance
// ==========================================

// Child class extending Course, calling super, and adding a field
export class OnlineCourse extends Course {
  platform: string;

  constructor(id: number, title: string, creditHours: number, platform: string) {
    super(id, title, creditHours);
    this.platform = platform;
  }

  // Replacing method with 'override' and calling super.method()
  override getSummary(): string {
    const baseSummary = super.getSummary();
    return `${baseSummary} [Platform: ${this.platform}]`;
  }
}

const onlineApp = new OnlineCourse(102, "Next.js Fullstack", 4, "GitHub Classroom");
onlineApp.enrollStudents(40);

// Array typed as the interface ICourse holding objects of both classes:
const courseCatalog: ICourse[] = [tsCourse, onlineApp];

console.log("\n--- Course Catalog Processing ---");
for (const course of courseCatalog) {
  console.log(course.getSummary());

  // Using instanceof to find child-class objects:
  if (course instanceof OnlineCourse) {
    console.log(`-> Identified online course on platform: ${course.platform}`);
  }
}

// ==========================================
// 7.3 — Break It (Recorded Errors in Comments)
// ==========================================

// 1. Reassigning readonly field & reading #private field from outside:
// tsCourse.id = 999;
// Error TS2540: Cannot assign to 'id' because it is a read-only property.

// console.log(tsCourse.#enrolledCount);
// Error TS18013: Property '#enrolledCount' is not accessible outside class 'Course' because it has a private identifier.

// 2. Deleting a required method from the class:
// If 'getSummary' is omitted in class Course:
// Error TS2420: Class 'Course' incorrectly implements interface 'ICourse'. Property 'getSummary' is missing in type 'Course' but required in type 'ICourse'.

// 3. Trying parameter properties syntax with erasableSyntaxOnly:
// class BadCourse {
//   constructor(private name: string) {}
// }
// Error TS5135: Parameter properties can not be used when 'erasableSyntaxOnly' is enabled.
// (Because parameter properties generate JS runtime assignment code during compilation instead of being cleanly erased).

// 4. Trying instanceof on the interface:
// if (tsCourse instanceof ICourse) {}
// Error TS2693: 'ICourse' only refers to a type, but is being used as a value here.
//
// Explanation:
// Interfaces exist solely at compile time in TypeScript and are completely erased
// when compiling down to JavaScript. At runtime, 'ICourse' does not exist in memory
// as an object or function prototype, so the JavaScript engine's 'instanceof' operator
// cannot evaluate it.