export interface SidebarProps {
  title: string;
  projects: string[];
}

export function Sidebar({ title, projects }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">{title}</h2>
      <ul className="sidebar-projects">
        {projects.map((project, index) => (
          <li key={`${project}-${index}`} className="sidebar-project-item">
            {project}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;