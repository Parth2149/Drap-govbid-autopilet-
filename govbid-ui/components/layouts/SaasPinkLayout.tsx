"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { AppNav } from "@/components/AppNav";
import { ArchitectureView } from "@/components/views/ArchitectureView";
import { KnowledgeBaseView } from "@/components/views/KnowledgeBaseView";
import { ProposalWorkspaceView } from "@/components/views/ProposalWorkspaceView";
import type { AppView } from "@/lib/navigation";
import type { WorkspaceState } from "@/lib/proposal-types";

const viewMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

export function SaasPinkLayout({ ws }: { ws: WorkspaceState }) {
  const [view, setView] = useState<AppView>("architecture");

  return (
    <div className="theme-pink relative flex min-h-screen flex-col">
      <div className="pink-bg" aria-hidden />
      <header className="sticky top-0 z-20 border-b border-pink-200/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <AppNav active={view} onChange={setView} />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <AnimatePresence mode="wait">
          {view === "architecture" && (
            <motion.div key="architecture" {...viewMotion}>
              <ArchitectureView />
            </motion.div>
          )}
          {view === "workspace" && (
            <motion.div key="workspace" {...viewMotion}>
              <ProposalWorkspaceView ws={ws} />
            </motion.div>
          )}
          {view === "knowledge" && (
            <motion.div key="knowledge" {...viewMotion}>
              <KnowledgeBaseView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-pink-200/60 bg-white/80 py-4">
        <p className="text-center text-xs text-stone-500">
          GovBid AI · NVIDIA × Nebius Hackathon · Dual-RAG proposal pipeline
        </p>
      </footer>
    </div>
  );
}
