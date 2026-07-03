import * as React from "react";
import { cn } from "@/lib/cn";

export interface NFInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const NFInput = React.forwardRef<HTMLInputElement, NFInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full",
          "rounded-2xl",
          "border border-white/60",
          "bg-white/60",
          "backdrop-blur-xl",
          "px-4 py-3",
          "text-slate-800",
          "placeholder:text-slate-400",
          "outline-none",
          "transition-all duration-300",
          "focus:border-blue-500",
          "focus:ring-4 focus:ring-blue-100",
          "shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);

NFInput.displayName = "NFInput";

export default NFInput;