import { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export default function NFCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[30px]",
        "border border-white/50",
        "bg-white/55",
        "backdrop-blur-3xl",
        "shadow-[0_25px_60px_rgba(15,23,42,0.08)]",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_35px_80px_rgba(15,23,42,0.12)]",
        className
      )}
      {...props}
    />
  );
}