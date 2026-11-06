import { useEffect, useState, type ComponentType } from "react";
import TaskList from "./components/TaskList";
import TaskDetails from "./pages/TaskDetails";

export function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", updatePathname);
    return () => window.removeEventListener("popstate", updatePathname);
  }, []);

  const taskRoute = pathname.match(/^\/projects\/([^/]+)\/tasks\/([^/]+)\/?$/);
  if (taskRoute) {
    const Details = TaskDetails as ComponentType<{ projectId: string; taskId: string }>;
    return <Details projectId={decodeURIComponent(taskRoute[1])} taskId={decodeURIComponent(taskRoute[2])} />;
  }

  if (pathname === "/" || /^\/projects\/[^/]+\/?$/.test(pathname)) {
    return <TaskList />;
  }

  return null;
}

export default App;