import { tasks as initialTasks } from "../data/tasks";
import Section from "../components/Section";
import { Badge } from "../components/Badge";
import TaskCard from "../components/TaskCard";

export function ProjectPage() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const projectsIndex = pathSegments.lastIndexOf("projects");
  const projectId = pathSegments[projectsIndex + 1] || "1";

  // 1. تصفية المهام التابعة للمشروع الحالي (إن وجدت خاصية projectId في المهمة، أو استخدام initialTasks)
  const projectTasks = initialTasks.filter((task) =>
    "projectId" in task ? String((task as { projectId?: string | number }).projectId) === projectId : true
  );

  // 2. حساب القيم المشتقة بدون إضافة أي state جديد (No new state)
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((task) => task.status === "done").length;
  const progressLine = `${completedTasks} of ${totalTasks} done`;

  // 3. عرض EmptyState في حال عدم وجود مهام بالمشروع
  if (totalTasks === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks in this project</h2>
        <p>Get started by creating your first task for this project.</p>
      </div>
    );
  }

  return (
    <Section
      title={`Project ${projectId}`}
      action={<Badge tone="neutral">{totalTasks} tasks</Badge>}
    >
      {/* سطر التقدم ورأس المشروع المشتق */}
      <div
        className="project-progress-header"
        style={{
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#4b5563",
            fontWeight: 500,
          }}
        >
          {progressLine}
        </p>
      </div>

      {/* قائمة المهام التابعة للمشروع */}
      <div className="task-list">
        {projectTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </Section>
  );
}

export default ProjectPage;