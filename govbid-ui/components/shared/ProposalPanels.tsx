"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Brain, Copy, Download, FileText, Loader2 } from "lucide-react";
import type { WorkspaceState } from "@/lib/proposal-types";
import { exportProposalPdf } from "@/lib/export-proposal-pdf";

const tracePlaceholder = "> Run a generation to view the reasoning trace.";
const traceLoading = "> Awaiting reasoning trace from Dual-RAG pipeline...";
const proposalEmpty =
  "Your generated proposal will appear here after the run completes.";

export function PromptForm({
  ws,
  generationUnlocked = false,
}: {
  ws: WorkspaceState;
  generationUnlocked?: boolean;
}) {
  const locked = !generationUnlocked;

  return (
    <form onSubmit={ws.handleSubmit} className="flex flex-col gap-4">
      <div className={locked ? "pointer-events-none opacity-50" : undefined}>
        <label
          htmlFor="prompt"
          className="mb-1.5 block text-sm font-medium text-rose-900/90"
        >
          Solicitation prompt
        </label>
        <textarea
          id="prompt"
          value={ws.prompt}
          onChange={(e) => ws.setPrompt(e.target.value)}
          rows={5}
          disabled={ws.loading || locked}
          className="w-full resize-y rounded-xl border border-pink-200 bg-rose-50/30 px-3.5 py-3 text-sm leading-relaxed text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 disabled:opacity-60"
        />
      </div>
      {locked && (
        <p className="text-xs text-stone-500">
          Ingest an RFP PDF above to unlock proposal generation.
        </p>
      )}
      <p className="text-xs text-stone-500">
        Responses include reasoning trace and formatted proposal draft.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={ws.loading || !ws.prompt.trim() || locked}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(236,72,153,0.4)] transition hover:shadow-[0_6px_28px_rgba(244,114,182,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ws.loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Synthesizing Dual-RAG… {ws.generationElapsedSec}s
            </>
          ) : (
            "Generate proposal"
          )}
        </button>
        {ws.lastGenerationSec !== null && !ws.loading && (
          <span className="text-xs font-medium text-emerald-700">
            Completed in {ws.lastGenerationSec}s
          </span>
        )}
      </div>
      {ws.error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {ws.error}
        </div>
      )}
    </form>
  );
}

export function ProposalPanels({ ws }: { ws: WorkspaceState }) {
  const proposalRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  async function handleDownloadPdf() {
    if (!proposalRef.current || !ws.proposal) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const renderedText =
        proposalRef.current.innerText?.trim() || ws.proposal.trim();
      await exportProposalPdf(renderedText);
    } catch (err) {
      console.error("PDF export error:", err);
      setPdfError("PDF export failed. Try again or use Copy.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <section className="flex min-h-[360px] flex-col overflow-hidden rounded-xl border border-pink-200/80 bg-white/90 shadow-sm shadow-pink-100/50">
        <div className="flex items-center gap-2 border-b border-pink-100 px-4 py-3">
          <Brain className="h-4 w-4 text-rose-500" />
          <div>
            <h2 className="text-sm font-semibold text-rose-950">Chain of thought</h2>
            <p className="text-xs text-stone-500">Model reasoning trace</p>
          </div>
        </div>
        <pre className="flex-1 overflow-auto bg-[#2a1524] px-4 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-rose-100/90">
          {ws.loading && !ws.reasoningTrace
            ? traceLoading
            : ws.reasoningTrace || tracePlaceholder}
        </pre>
      </section>

      <section className="flex min-h-[360px] flex-col overflow-hidden rounded-xl border border-pink-200/80 bg-white/90 shadow-sm shadow-pink-100/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-pink-500" />
            <div>
              <h2 className="text-sm font-semibold text-rose-950">Proposal draft</h2>
              <p className="text-xs text-stone-500">Markdown preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={ws.handleCopy}
              disabled={!ws.proposal}
              className="inline-flex items-center gap-1.5 rounded-md border border-pink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy className="h-3.5 w-3.5" />
              {ws.copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={!ws.proposal || pdfLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-pink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pdfLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Download PDF
            </button>
          </div>
        </div>
        {pdfError && (
          <p className="border-b border-pink-100 bg-red-50 px-4 py-2 text-xs text-red-700">
            {pdfError}
          </p>
        )}
        <div
          ref={proposalRef}
          className="markdown-output flex-1 overflow-auto bg-white px-4 py-4 text-sm text-stone-800"
        >
          {ws.loading && !ws.proposal ? (
            <p className="text-stone-500">Composing markdown draft...</p>
          ) : ws.proposal ? (
            <div className="prose prose-invert prose-th:text-emerald-400 prose-td:border-slate-700">
              <ReactMarkdown
                // @ts-expect-error react-markdown v10 types omit className prop
                className="prose prose-invert prose-th:text-emerald-400 prose-td:border-slate-700"
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
              >
                {ws.proposal}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-stone-500">{proposalEmpty}</p>
          )}
        </div>
      </section>
    </div>
  );
}
