import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  error?: string;
}

export default function NFFormField({
  label,
  children,
  error,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}