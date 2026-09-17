"use client";

import { useEffect, useRef, useState } from "react";
import type { GenerateResponse } from "@/lib/proposal-types";

export const DEFAULT_PROMPT =
  "Draft a technical proposal for the ETRM migration explicitly mapping our AWS and database capabilities to the mandatory requirements.";

export function useProposalWorkspace() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [loading, setLoading] = useState(false);
  const [reasoningTrace, setReasoningTrace] = useState("");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generationElapsedSec, setGenerationElapsedSec] = useState(0);
  const [lastGenerationSec, setLastGenerationSec] = useState<number | null>(null);
  const generationStartedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!loading) {
      setGenerationElapsedSec(0);
      return;
    }

    generationStartedAt.current = Date.now();
    setGenerationElapsedSec(0);

    const interval = setInterval(() => {
      if (generationStartedAt.current) {
        setGenerationElapsedSec(
          Math.floor((Date.now() - generationStartedAt.current) / 1000)
        );
      }
    }, 250);

    return () => clearInterval(interval);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReasoningTrace("");
    setProposal("");
    setLastGenerationSec(null);

    try {
      const generateUrl =
        process.env.NEXT_PUBLIC_N8N_GENERATE_PROPOSAL_URL ||
        "https://emblaze-stroller-footman.ngrok-free.dev/webhook/generate-proposal";

      const res = await fetch(generateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status} ${res.statusText}`);
      }

      const data: GenerateResponse = await res.json();
      setReasoningTrace(data.reasoning_trace ?? "");
      setProposal(data.proposal ?? "");
    } catch (err) {
      const message =
        err instanceof TypeError && err.message.includes("fetch")
          ? "Could not reach the proposal service. Ensure your n8n workflow and webhook are active."
          : err instanceof Error
            ? err.message
            : "An unexpected error occurred.";
      setError(message);
    } finally {
      if (generationStartedAt.current) {
        setLastGenerationSec(
          Math.max(0, Math.floor((Date.now() - generationStartedAt.current) / 1000))
        );
      }
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!proposal) return;
    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  }

  return {
    prompt,
    setPrompt,
    loading,
    reasoningTrace,
    proposal,
    error,
    copied,
    generationElapsedSec,
    lastGenerationSec,
    handleSubmit,
    handleCopy,
  };
}
