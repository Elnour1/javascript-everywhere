
export interface SidebarProps {
  title: string;
  projects: string[];
}

export function Sidebar({ title, projects }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav>
        <h2 className="sidebar-title">{title}</h2>
        <ul className="project-list">
          {projects.map((project, index) => (
            <li
              key={`${project}-${index}`}
              className={`project-item ${index === 0 ? 'active' : ''}`}
            >
              {project}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;