import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

export default function NFLabel({
  className,
  ...props
}: Props) {
  return (
    <label
      className={cn(
        "mb-2 block",
        "text-sm font-semibold",
        "text-slate-700",
        className
      )}
      {...props}
    />
  );
}