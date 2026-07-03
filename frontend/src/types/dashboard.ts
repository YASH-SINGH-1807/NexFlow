import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
}