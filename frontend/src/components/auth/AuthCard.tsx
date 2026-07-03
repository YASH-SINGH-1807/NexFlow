import type { ReactNode } from "react";

import NFCard from "@/components/ui/NFCard";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <NFCard className="w-full max-w-md p-10">
        <h1 className="text-4xl font-black text-slate-800">
          {title}
        </h1>

        <p className="mt-3 mb-8 text-slate-500">
          {subtitle}
        </p>

        {children}
      </NFCard>
    </div>
  );
}