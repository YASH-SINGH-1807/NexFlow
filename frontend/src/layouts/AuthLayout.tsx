import type { ReactNode } from "react";

import AnimatedBackground from "@/components/background/AnimatedBackground";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: Props) {
  return (
    <>
      <AnimatedBackground />
      {children}
    </>
  );
}