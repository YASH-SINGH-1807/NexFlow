import {
  Database,
  FolderKanban,
  PlayCircle,
  Workflow,
} from "lucide-react";

import DashboardStatCard from "./DashboardStatCard";

const stats = [
  {
    id: "1",
    title: "Workspaces",
    value: "12",
    description: "Active engineering workspaces",
    trend: "+2 Today",
    icon: FolderKanban,
  },
  {
    id: "2",
    title: "Pipelines",
    value: "18",
    description: "Running data pipelines",
    trend: "+5%",
    icon: Workflow,
  },
  {
    id: "3",
    title: "Jobs",
    value: "42",
    description: "Executed today",
    trend: "99.8%",
    icon: PlayCircle,
  },
  {
    id: "4",
    title: "Storage",
    value: "14 GB",
    description: "Database usage",
    trend: "+1.2 GB",
    icon: Database,
  },
];

export default function DashboardStats() {
  return (
    <section
      className="
        mt-10
        grid
        gap-6
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {stats.map((stat) => {
  const Icon = stat.icon;

  return (
    <DashboardStatCard
      key={stat.id}
      title={stat.title}
      value={stat.value}
      icon={
        <Icon
          size={28}
          className="text-blue-600"
        />
      }
    />
  );
})}
    </section>
  );
}