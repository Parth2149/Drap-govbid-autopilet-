export const glassCard =
  "rounded-xl border border-pink-200/70 bg-white/80 shadow-sm shadow-pink-100/60 backdrop-blur-md";

export const glassPanel =
  "rounded-xl border border-pink-200/80 bg-white/90 shadow-sm shadow-pink-100/50";

export const floatTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};
