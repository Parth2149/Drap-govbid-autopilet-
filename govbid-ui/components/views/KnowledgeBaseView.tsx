"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { fadeUp, glassCard } from "@/lib/ui-styles";

const PAST_PERFORMANCE = [
  {
    id: "PP-001",
    capability: "AWS ETRM Migration",
    domain: "Energy / Commodity Trading",
    evidence: "Migrated legacy ETRM workloads to AWS with zero-downtime cutover.",
    vectorId: "vec_etrm_aws_014",
  },
  {
    id: "PP-002",
    capability: "PostgreSQL HA on RDS",
    domain: "Database Engineering",
    evidence: "Multi-AZ RDS with read replicas and automated failover runbooks.",
    vectorId: "vec_rds_ha_022",
  },
  {
    id: "PP-003",
    capability: "FedRAMP Moderate Boundary",
    domain: "Cloud Security",
    evidence: "Landing zone design aligned to NIST 800-53 control families.",
    vectorId: "vec_fedramp_008",
  },
  {
    id: "PP-004",
    capability: "SAP Integration Hub",
    domain: "Enterprise Integration",
    evidence: "Event-driven interfaces between SAP and external risk systems.",
    vectorId: "vec_sap_int_031",
  },
  {
    id: "PP-005",
    capability: "Dual-RAG Proposal Automation",
    domain: "AI / Capture",
    evidence: "n8n agents + Supabase retrieval for compliant draft generation.",
    vectorId: "vec_rag_gov_003",
  },
];

export function KnowledgeBaseView() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <motion.div {...fadeUp} className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-600">
          RAG context source
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-950 sm:text-3xl">
          Knowledge base — past performance
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Mock capability records stored in Supabase vector storage. Dual-RAG retrieval
          pulls the most relevant rows for each solicitation prompt.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.06 }}
        className={`overflow-hidden ${glassCard}`}
      >
        <div className="flex items-center gap-2 border-b border-pink-100 px-4 py-3">
          <BookOpen className="h-4 w-4 text-rose-500" />
          <h2 className="text-sm font-semibold text-rose-950">Indexed capabilities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-pink-100 bg-rose-50/50 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Capability</th>
                <th className="px-4 py-3 font-semibold">Domain</th>
                <th className="px-4 py-3 font-semibold">Evidence snippet</th>
                <th className="px-4 py-3 font-semibold">Vector ref</th>
              </tr>
            </thead>
            <tbody>
              {PAST_PERFORMANCE.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-pink-50/80 transition hover:bg-pink-50/40"
                >
                  <td className="px-4 py-3 font-mono text-xs text-rose-800">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-rose-950">{row.capability}</td>
                  <td className="px-4 py-3 text-stone-600">{row.domain}</td>
                  <td className="max-w-xs px-4 py-3 text-xs leading-relaxed text-stone-600">
                    {row.evidence}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-pink-700">{row.vectorId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
