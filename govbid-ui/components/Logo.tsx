const GRADIENT_ID = "govbid-logo-gradient";
const GLOW_ID = "govbid-logo-glow";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id={GRADIENT_ID} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <filter id={GLOW_ID} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M24 5 C14 5 9 12 9 20 C9 28 16 36 24 42"
          stroke={`url(#${GRADIENT_ID})`}
          strokeWidth="2.25"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${GLOW_ID})`}
        />
        <path
          d="M24 5 C34 5 39 12 39 20 C39 28 32 36 24 42"
          stroke={`url(#${GRADIENT_ID})`}
          strokeWidth="2.25"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${GLOW_ID})`}
        />

        <rect
          x="18"
          y="18"
          width="12"
          height="12"
          rx="1"
          fill={`url(#${GRADIENT_ID})`}
          transform="rotate(45 24 24)"
          filter={`url(#${GLOW_ID})`}
        />
      </svg>

      <span className="text-lg font-semibold tracking-tight text-rose-950">
        Drapbid
        <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
          .ai
        </span>
      </span>
    </div>
  );
}
