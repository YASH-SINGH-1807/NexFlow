import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Workflow,
  PlayCircle,
  FileText,
} from "lucide-react";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside
      className="
        h-screen
        w-72
        border-r
        border-white/40
        bg-white/40
        backdrop-blur-3xl
        shadow-2xl
        p-6
      "
    >
      <h1 className="mb-12 text-4xl font-black tracking-tight text-slate-800">
        NexFlow
      </h1>

      <nav className="space-y-3">

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to="/"
        />

        <SidebarItem
          icon={<Workflow size={20} />}
          label="Pipelines"
          to="/pipelines"
        />

        <SidebarItem
          icon={<FolderKanban size={20} />}
          label="Workspaces"
          to="/workspaces"
        />

        <SidebarItem
          icon={<PlayCircle size={20} />}
          label="Jobs"
          to="/jobs"
        />

        <SidebarItem
          icon={<FileText size={20} />}
          label="Logs"
          to="/logs"
        />

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
        />

      </nav>
    </aside>
  );
}