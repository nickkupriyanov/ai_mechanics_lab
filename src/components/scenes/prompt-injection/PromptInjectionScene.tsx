"use client";

import { useMemo } from "react";
import { usePromptInjectionStore } from "@/store/prompt-injection-store";
import { isInjectionDetected } from "@/lib/simulation/prompt-injection";
import { InjectionPipeline } from "./InjectionPipeline";
import { DocumentsList } from "./DocumentsList";
import { InjectionContextPanel } from "./InjectionContextPanel";
import { InjectionResultPanel } from "./InjectionResultPanel";
import { InjectionControls } from "./InjectionControls";

export function PromptInjectionScene() {
  const {
    selectedAttackType,
    selectedQueryId,
    enableHierarchy,
    enableSanitization,
    poisonedDocActive,
    showInjectedContent,
  } = usePromptInjectionStore();

  const injectionDetected = useMemo(
    () =>
      isInjectionDetected({
        poisonedDocActive,
        enableHierarchy,
        enableSanitization,
      }),
    [poisonedDocActive, enableHierarchy, enableSanitization],
  );

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <InjectionPipeline injectionDetected={injectionDetected} />

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr_280px] lg:grid-cols-[1fr_1fr_320px]">
        {/* Column 1: Documents + Context */}
        <div className="space-y-4 min-w-0">
          <DocumentsList
            showInjected={showInjectedContent}
            poisonedDocActive={poisonedDocActive}
            enableSanitization={enableSanitization}
          />
          <InjectionResultPanel
            queryId={selectedQueryId}
            attackType={selectedAttackType}
            enableHierarchy={enableHierarchy}
            enableSanitization={enableSanitization}
            poisonedDocActive={poisonedDocActive}
          />
        </div>

        {/* Column 2: Prompt context */}
        <div className="min-w-0">
          <InjectionContextPanel
            selectedQueryId={selectedQueryId}
            poisonedDocActive={poisonedDocActive}
            enableSanitization={enableSanitization}
            injectionDetected={injectionDetected}
          />
        </div>

        {/* Column 3: Controls */}
        <div className="space-y-4">
          <InjectionControls />
        </div>
      </div>
    </div>
  );
}
