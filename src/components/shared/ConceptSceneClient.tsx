"use client";

import { useTranslations } from "next-intl";
import { RagScene } from "@/components/scenes/rag/RagScene";
import { EmbeddingsScene } from "@/components/scenes/embeddings/EmbeddingsScene";
import { VectorSearchScene } from "@/components/scenes/vector-search/VectorSearchScene";
import { ContextWindowScene } from "@/components/scenes/context-window/ContextWindowScene";
import { ToolCallingScene } from "@/components/scenes/tool-calling/ToolCallingScene";
import { MCPScene } from "@/components/scenes/mcp/MCPScene";
import { AgentsScene } from "@/components/scenes/agents/AgentsScene";
import { MemoryScene } from "@/components/scenes/memory/MemoryScene";
import { PromptInjectionScene } from "@/components/scenes/prompt-injection/PromptInjectionScene";
import { EvaluationScene } from "@/components/scenes/evaluation/EvaluationScene";
import { SceneShell } from "@/components/shared/SceneShell";
import { BreakItChallenges } from "@/components/shared/BreakItChallenges";
import { getChallenges } from "@/lib/challenges";
import type { ConceptSlug } from "@/types/concept";

import { useRagStore } from "@/store/rag-store";
import { useContextWindowStore } from "@/store/context-window-store";
import { useToolCallingStore } from "@/store/tool-calling-store";
import { useAgentsStore } from "@/store/agents-store";
import { useMemoryStore } from "@/store/memory-store";
import { useMCPStore } from "@/store/mcp-store";
import { usePromptInjectionStore } from "@/store/prompt-injection-store";
import { useEvaluationStore } from "@/store/evaluation-store";

function applyPreset(slug: ConceptSlug, presetId: string) {
  switch (slug) {
    case "rag":
      useRagStore.getState().applyPreset(presetId);
      break;
    case "context-window":
      useContextWindowStore.getState().applyPreset(presetId);
      break;
    case "tool-calling":
      useToolCallingStore.getState().applyPreset(presetId);
      break;
    case "agents":
      useAgentsStore.getState().applyPreset(presetId);
      break;
    case "memory":
      useMemoryStore.getState().applyPreset(presetId);
      break;
    case "mcp":
      useMCPStore.getState().applyPreset(presetId);
      break;
    case "prompt-injection":
      usePromptInjectionStore.getState().applyPreset(presetId);
      break;
    case "evaluation":
      useEvaluationStore.getState().applyPreset(presetId);
      break;
  }
}

type ConceptSceneClientProps = {
  slug: ConceptSlug;
  title: string;
};

export function ConceptSceneClient({ slug, title }: ConceptSceneClientProps) {
  const t = useTranslations("BreakIt");

  const challenges = getChallenges(
    slug,
    (key) => {
      const v = t(key);
      return typeof v === "string" ? v : "";
    },
  );

  const sceneContent = (() => {
    switch (slug) {
      case "rag":
        return <RagScene />;
      case "embeddings":
        return <EmbeddingsScene />;
      case "vector-search":
        return <VectorSearchScene />;
      case "context-window":
        return <ContextWindowScene />;
      case "tool-calling":
        return <ToolCallingScene />;
      case "mcp":
        return <MCPScene />;
      case "agents":
        return <AgentsScene />;
      case "memory":
        return <MemoryScene />;
      case "prompt-injection":
        return <PromptInjectionScene />;
      case "evaluation":
        return <EvaluationScene />;
      default:
        return (
          <SceneShell title="Interactive Scene" simplified>
            <div className="bp-grid-dense flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-10 text-center">
              <div className="mb-3 rounded-full border border-border p-3">
                <svg
                  className="h-6 w-6 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-secondary">
                Interactive scene coming soon
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Controls, visualizations, and failure modes for {title} are in development.
              </p>
            </div>
          </SceneShell>
        );
    }
  })();

  return (
    <>
      {sceneContent}
      <BreakItChallenges
        challenges={challenges}
        onApplyPreset={(presetId) => applyPreset(slug, presetId)}
      />
    </>
  );
}
