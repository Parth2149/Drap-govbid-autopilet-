"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Database,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { fadeUp, floatTransition, glassCard } from "@/lib/ui-styles";

const metrics = [
  { label: "100% Compliance Mapping", desc: "Mandatory RFP clauses traced to evidence" },
  { label: "< 90s Draft Latency", desc: "Dual-RAG synthesis on Nemotron-120B" },
  { label: "Hybrid Vector Recall", desc: "Supabase pgvector + rerank pass" },
];

const pipeline = [
  {
    icon: Workflow,
    title: "n8n orchestration",
    body: "Webhook ingress, agent routing, and structured JSON responses for the UI.",
  },
  {
    icon: Database,
    title: "Supabase vector storage",
    body: "Past performance and capability chunks embedded for semantic retrieval.",
  },
  {
    icon: Brain,
    title: "Nemotron-120B reasoning",
    body: "Chain-of-thought synthesis with requirement-level justification.",
  },
];

export function ArchitectureView() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <motion.div {...fadeUp} className="max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-600">
          System architecture
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-950 sm:text-3xl">
          Dual-RAG pipeline built for auditable gov proposals
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          Drapbid AI combines workflow automation, vector search over your knowledge base,
          and large-model reasoning to produce compliance-ready drafts with a visible
          trace you can defend in capture reviews.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            animate={{ y: [0, -8, 0] }}
            transition={{ ...floatTransition, delay: i * 0.35 }}
            className={`p-5 ${glassCard}`}
          >
            <ShieldCheck className="mb-3 h-5 w-5 text-rose-500" />
            <p className="text-sm font-bold text-rose-950">{metric.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">{metric.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.08 }}
        className={`p-6 ${glassCard}`}
      >
        <div className="mb-6 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-pink-500" />
          <h2 className="text-base font-semibold text-rose-950">End-to-end flow</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pipeline.map((step, i) => (
            <motion.div
              key={step.title}
              animate={{ y: [0, -6, 0] }}
              transition={{ ...floatTransition, delay: 0.5 + i * 0.4 }}
              className="rounded-lg border border-pink-100/80 bg-white/70 p-4"
            >
              <step.icon className="mb-2 h-4 w-4 text-rose-600" />
              <p className="text-sm font-semibold text-rose-950">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">{step.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-pink-100 bg-rose-50/40 px-4 py-3 text-xs text-stone-600">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
          <p>
            Solicitation text enters via the Proposal workspace webhook. Retrieved
            capability snippets and mandatory requirements are fused before Nemotron
            emits both <strong className="text-rose-900">reasoning_trace</strong> and{" "}
            <strong className="text-rose-900">proposal</strong> payloads to the UI.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
