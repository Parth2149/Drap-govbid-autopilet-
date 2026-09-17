"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, Loader2, Sparkles, Upload } from "lucide-react";
import { DEFAULT_PROMPT } from "@/hooks/use-proposal-workspace";

const DEMO_FILE_NAME = "CPA_ETRM_Solicitation_Sample.pdf";

type RfpUploadZoneProps = {
  onIngestSuccess?: () => void;
  onLoadDemo?: (prompt: string) => void;
};

export function RfpUploadZone({ onIngestSuccess, onLoadDemo }: RfpUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rfpFile, setRfpFile] = useState<File | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isIngested, setIsIngested] = useState(false);
  const [demoBanner, setDemoBanner] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const applyFile = useCallback((file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setIngestError("Please upload a PDF document.");
      return;
    }
    setRfpFile(file);
    setIsIngested(false);
    setDemoBanner(false);
    setIngestError(null);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    applyFile(file ?? null);
  }

  function handleLoadDemo(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const demoFile = new File(["demo"], DEMO_FILE_NAME, { type: "application/pdf" });
    setRfpFile(demoFile);
    setIsIngested(true);
    setDemoBanner(true);
    setIngestError(null);
    onLoadDemo?.(DEFAULT_PROMPT);
    onIngestSuccess?.();
  }

  async function handleIngest(e: React.MouseEvent) {
    e.preventDefault();
    if (!rfpFile || isIngested) return;

    setIsIngesting(true);
    setIngestError(null);

    try {
      const formData = new FormData();
      formData.append("file", rfpFile);

      const ingestUrl =
        process.env.NEXT_PUBLIC_N8N_INGEST_RFP_URL ||
        "https://emblaze-stroller-footman.ngrok-free.dev/webhook/ingest-rfp";

      const res = await fetch(ingestUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Ingest failed (${res.status})`);
      }

      setIsIngested(true);
      setDemoBanner(false);
      onIngestSuccess?.();
    } catch (err) {
      const message =
        err instanceof TypeError && err.message.includes("fetch")
          ? "Could not reach ingest service. Ensure your n8n workflow and webhook are active."
          : err instanceof Error
            ? err.message
            : "Ingest failed.";
      setIngestError(message);
    } finally {
      setIsIngesting(false);
    }
  }

  return (
    <motion.div layout className="mb-6 flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
      />

      <motion.div
        layout
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragOver
            ? "border-pink-500 bg-pink-50/50 shadow-[0_0_28px_rgba(236,72,153,0.45)]"
            : "border-pink-300/70 bg-white/40 shadow-[0_0_20px_rgba(244,114,182,0.2)] backdrop-blur-md hover:border-pink-400 hover:bg-white/50"
        }`}
      >
        <Upload className="mx-auto mb-2 h-8 w-8 text-pink-500" strokeWidth={1.5} />
        <p className="text-sm font-medium text-rose-950">
          Drag & drop RFP document (PDF) or click to browse
        </p>
        <p className="mt-1 text-xs text-stone-500">PDF only · embedded into vector store</p>

        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href="/sample-rfp.pdf"
            download="Sample_Gov_RFP.pdf"
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-rose-800 transition hover:border-pink-400 hover:bg-pink-50"
          >
            <Download className="h-3.5 w-3.5 text-pink-500" />
            Download Sample RFP (PDF)
          </a>
          <button
            type="button"
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)] transition hover:shadow-[0_6px_20px_rgba(244,114,182,0.5)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Load Demo RFP (1-Click)
          </button>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {rfpFile && (
          <motion.div
            key="file-meta"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pink-200/80 bg-white/60 px-3 py-2 backdrop-blur-sm">
              <p className="truncate text-sm font-medium text-rose-950">{rfpFile.name}</p>
              {isIngested ? (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Ingested
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Ready to ingest
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isIngested && (
        <button
          type="button"
          onClick={handleIngest}
          disabled={!rfpFile || isIngesting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-pink-300/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-rose-900 transition hover:border-pink-400 hover:bg-pink-50/80 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isIngesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ingesting RFP...
            </>
          ) : (
            "Ingest RFP"
          )}
        </button>
      )}

      <AnimatePresence initial={false}>
        {demoBanner && (
          <motion.div
            key="demo-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-pink-200/80 bg-gradient-to-r from-pink-50/90 to-rose-50/80 px-3 py-2 text-sm text-rose-900">
              Sample Clean Power Alliance RFP loaded successfully. Ready to generate.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isIngested && !demoBanner && (
          <motion.div
            key="ingest-success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              RFP embedded and stored successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {ingestError && (
        <p className="text-sm text-red-600" role="alert">
          {ingestError}
        </p>
      )}
    </motion.div>
  );
}
