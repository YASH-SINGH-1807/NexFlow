import DashboardLayout from "@/layouts/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Settings
        </h1>

        <p className="mt-3 text-slate-500">
          Manage your NexFlow preferences and configuration.
        </p>
      </div>
    </DashboardLayout>
  );
}