import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function DashboardStatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        rounded-3xl
        border
        border-white/60
        bg-white/55
        backdrop-blur-2xl
        shadow-xl
        p-6
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-slate-800">
            {value}
          </h2>

        </div>

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-blue-100
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}