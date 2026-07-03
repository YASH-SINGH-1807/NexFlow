import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export default function SidebarItem({
  icon,
  label,
  to,
}: SidebarItemProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <motion.div
          whileHover={{
            x: 6,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className={cn(
            "flex items-center gap-4",
            "rounded-2xl",
            "px-4 py-3",
            "transition-all duration-300",
            "cursor-pointer",
            isActive
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
          )}
        >
          <span className="text-xl">{icon}</span>

          <span className="font-medium">{label}</span>
        </motion.div>
      )}
    </NavLink>
  );
}