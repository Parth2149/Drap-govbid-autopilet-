export type GenerateResponse = {
  reasoning_trace?: string;
  proposal?: string;
};

export type WorkspaceState = {
  prompt: string;
  setPrompt: (value: string) => void;
  loading: boolean;
  reasoningTrace: string;
  proposal: string;
  error: string | null;
  copied: boolean;
  generationElapsedSec: number;
  lastGenerationSec: number | null;
  handleSubmit: (e: React.FormEvent) => void;
  handleCopy: () => void;
};
