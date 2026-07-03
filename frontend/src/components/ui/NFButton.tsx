import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-2xl",
    "font-semibold",
    "transition-all duration-300",
    "focus:outline-none",
    "focus:ring-4 focus:ring-blue-200",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-[0.98]",
    "cursor-pointer",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5",

        secondary:
          "bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 hover:-translate-y-0.5",

        outline:
          "border border-slate-300 bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white",

        ghost:
          "text-slate-700 hover:bg-slate-100",

        danger:
          "bg-red-600 text-white hover:bg-red-700",
      },

      size: {
        sm: "h-9 px-4 text-sm",

        md: "h-11 px-6",

        lg: "h-14 px-8 text-lg",

        icon: "h-11 w-11",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface NFButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export default function NFButton({
  className,
  variant,
  size,
  ...props
}: NFButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}