import DashboardLayout from "@/layouts/DashboardLayout";

export default function JobsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Jobs
        </h1>

        <p className="mt-3 text-slate-500">
          Monitor pipeline executions and job status.
        </p>
      </div>
    </DashboardLayout>
  );
}