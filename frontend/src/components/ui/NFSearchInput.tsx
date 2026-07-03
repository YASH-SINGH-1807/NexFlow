import { Search } from "lucide-react";

export default function NFSearchInput() {
  return (
    <div
      className="
        flex items-center gap-3
        w-[420px]
        rounded-2xl
        border border-white/50
        bg-white/60
        px-4 py-3
        backdrop-blur-2xl
        shadow-lg
        transition-all
        duration-300
        focus-within:shadow-xl
      "
    >
      <Search
        size={18}
        className="text-slate-400"
      />

      <input
        placeholder="Search pipelines..."
        className="
          w-full
          bg-transparent
          outline-none
          text-slate-700
          placeholder:text-slate-400
        "
      />
    </div>
  );
}