import type { ReactNode } from "react";

import AnimatedBackground from "@/components/background/AnimatedBackground";
import Sidebar from "@/components/navigation/Sidebar";
import Topbar from "@/components/navigation/Topbar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <>
      <AnimatedBackground />

      <div className="flex min-h-screen p-6 gap-6">

        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden rounded-[32px] border border-white/50 bg-white/25 backdrop-blur-3xl shadow-2xl">

          <Topbar />

          <main className="flex-1 overflow-y-auto p-10">
            {children}
          </main>

        </div>

      </div>
    </>
  );
}