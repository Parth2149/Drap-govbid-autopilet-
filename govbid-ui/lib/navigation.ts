export type AppView = "architecture" | "workspace" | "knowledge";

export const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "architecture", label: "Architecture" },
  { id: "workspace", label: "Proposal workspace" },
  { id: "knowledge", label: "Knowledge base" },
];
