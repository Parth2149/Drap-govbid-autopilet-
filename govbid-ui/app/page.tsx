"use client";

import { SaasPinkLayout } from "@/components/layouts/SaasPinkLayout";
import { useProposalWorkspace } from "@/hooks/use-proposal-workspace";

export default function Home() {
  const ws = useProposalWorkspace();
  return <SaasPinkLayout ws={ws} />;
}
