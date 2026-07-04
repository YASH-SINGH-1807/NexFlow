import DashboardLayout from "@/layouts/DashboardLayout";

export default function PipelinePage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Pipelines
        </h1>

        <p className="mt-3 text-slate-500">
          Design, manage, and monitor your data pipelines.
        </p>
      </div>
    </DashboardLayout>
  );
}