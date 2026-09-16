"use client";

import type { AppView } from "@/lib/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

type AppNavProps = {
  active: AppView;
  onChange: (view: AppView) => void;
};

export function AppNav({ active, onChange }: AppNavProps) {
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-pink-200/60 bg-white/60 p-1 backdrop-blur-sm">
      {NAV_ITEMS.map((item) => {
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              selected
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
                : "text-rose-900/80 hover:bg-pink-50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
