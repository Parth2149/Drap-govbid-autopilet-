"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RfpUploadZone } from "@/components/RfpUploadZone";
import type { WorkspaceState } from "@/lib/proposal-types";
import { PromptForm, ProposalPanels } from "@/components/shared/ProposalPanels";
import { fadeUp, glassPanel } from "@/lib/ui-styles";

export function ProposalWorkspaceView({ ws }: { ws: WorkspaceState }) {
  const [generationUnlocked, setGenerationUnlocked] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <motion.div {...fadeUp} className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-600">
          Dual-RAG synthesis
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-950 sm:text-3xl">
          Proposal workspace
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Submit a solicitation prompt, review the reasoning trace, export the draft as
          Markdown or PDF.
        </p>
      </motion.div>

      <motion.section
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.06 }}
        className={`p-6 ${glassPanel}`}
      >
        <div className="mb-5 border-b border-pink-100 pb-4">
          <h2 className="text-base font-semibold text-rose-950">New proposal run</h2>
          <p className="mt-1 text-sm text-stone-500">
            Describe the RFP scope or paste key solicitation language below.
          </p>
        </div>
        <RfpUploadZone
          onIngestSuccess={() => setGenerationUnlocked(true)}
          onLoadDemo={(prompt) => ws.setPrompt(prompt)}
        />
        <PromptForm ws={ws} generationUnlocked={generationUnlocked} />
      </motion.section>

      <ProposalPanels ws={ws} />
    </div>
  );
}
