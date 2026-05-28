"use client";

import { useTranslations } from "next-intl";
import { useAgentsStore } from "@/store/agents-store";
import { agentScenarios } from "@/lib/simulation/agents";
import { AgentLoop } from "./AgentLoop";
import { StepLog } from "./StepLog";
import { AgentsControls } from "./AgentsControls";

export function AgentsScene() {
  const t = useTranslations("Agents.pipeline");
  const scenarioId = useAgentsStore((s) => s.scenarioId);
  const enabled = useAgentsStore((s) => s.enableReflection);

  const scenario =
    agentScenarios.find((s) => s.id === scenarioId) ?? agentScenarios[0];

  return (
    <div className="space-y-6">
      {/* Loop diagram */}
      <div className="rounded-lg border border-border bg-surface px-2 py-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
              {t("agentLoop")}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
            <span>
              {t("steps")}: {scenario.steps.length}
            </span>
            <span>
              {t("reflection")}: {enabled ? t("on") : t("off")}
            </span>
          </div>
        </div>
        <AgentLoop />
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <StepLog />
        </div>
        <div className="space-y-4">
          <AgentsControls />
        </div>
      </div>
    </div>
  );
}
