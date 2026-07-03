import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50">

      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 120, 0],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-300/30 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 120, -80, 0],
          scale: [1, 0.9, 1.3, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-150px] right-[-100px] h-[520px] w-[520px] rounded-full bg-violet-300/30 blur-[150px]"
      />

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
      />

      <div className="absolute inset-0 bg-white/25 backdrop-blur-3xl" />
    </div>
  );
}