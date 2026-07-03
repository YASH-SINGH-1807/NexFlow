import { BriefcaseBusiness, Database, FolderKanban, Workflow } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* Header */}

        <section>
          <h1 className="text-5xl font-black tracking-tight text-slate-800">
            Welcome back 👋
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Manage your data pipelines and workspaces from one place.
          </p>
        </section>

        {/* Statistics */}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <DashboardStatCard
            title="Workspaces"
            value="0"
            icon={<FolderKanban size={28} className="text-blue-600" />}
          />

          <DashboardStatCard
            title="Pipelines"
            value="0"
            icon={<Workflow size={28} className="text-violet-600" />}
          />

          <DashboardStatCard
            title="Jobs"
            value="0"
            icon={<BriefcaseBusiness size={28} className="text-emerald-600" />}
          />

          <DashboardStatCard
            title="Storage"
            value="0 GB"
            icon={<Database size={28} className="text-orange-600" />}
          />

        </section>

        {/* Recent Workspaces */}

        <section
          className="
            rounded-3xl
            border
            border-white/60
            bg-white/55
            backdrop-blur-2xl
            shadow-xl
            p-8
          "
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Workspaces
          </h2>

          <p className="mt-2 text-slate-500">
            Your recently created workspaces will appear here.
          </p>

          <div
            className="
              mt-8
              flex
              h-56
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-slate-200
            "
          >
            <div className="text-center">

              <FolderKanban
                size={56}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-xl font-semibold text-slate-700">
                No Workspaces Yet
              </h3>

              <p className="mt-2 text-slate-500">
                Create your first workspace to start building data pipelines.
              </p>

            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}