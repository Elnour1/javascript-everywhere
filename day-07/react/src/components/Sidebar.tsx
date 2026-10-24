function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <h2 className="sidebar-title">Projects</h2>
        <ul className="project-list">
          <li className="project-item active">Website Redesign</li>
          <li className="project-item">Mobile App</li>
          <li className="project-item">Marketing</li>
          <li className="project-item">Design System</li>
        </ul>
      </nav>
    </aside>
  );
}
export default Sidebar;