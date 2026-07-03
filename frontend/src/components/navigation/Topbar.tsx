import { Bell } from "lucide-react";

import NFAvatar from "@/components/ui/NFAvatar";
import NFSearchInput from "@/components/ui/NFSearchInput";

export default function Topbar() {
  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/40
        bg-white/25
        px-10
        py-6
        backdrop-blur-xl
      "
    >
      <NFSearchInput />

      <div className="flex items-center gap-6">

        <button
          className="
            rounded-2xl
            bg-white/60
            p-3
            shadow-lg
            transition-all
            hover:-translate-y-0.5
          "
        >
          <Bell size={20} />
        </button>

        <NFAvatar name="Yash" />

      </div>
    </header>
  );
}