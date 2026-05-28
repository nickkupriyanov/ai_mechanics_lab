"use client";

import { useMemo } from "react";
import { useGuardrailsStore } from "@/store/guardrails-store";
import {
  guardScenarios,
  evaluateInputGuard,
  evaluateOutputGuard,
} from "@/lib/simulation/guardrails";
import { GuardrailsPipeline } from "./GuardrailsPipeline";
import { GuardInputPanel } from "./GuardInputPanel";
import { GuardOutputPanel } from "./GuardOutputPanel";
import { GuardrailsControls } from "./GuardrailsControls";

export function GuardrailsScene() {
  const {
    selectedScenarioId,
    strictness,
    inputGuardEnabled,
    outputGuardEnabled,
    enabledCategories,
  } = useGuardrailsStore();

  const scenario = useMemo(
    () => guardScenarios.find((s) => s.id === selectedScenarioId),
    [selectedScenarioId],
  );

  const inputResult = useMemo(() => {
    if (!scenario) return null;
    return evaluateInputGuard(
      scenario,
      strictness,
      enabledCategories,
      inputGuardEnabled,
    );
  }, [scenario, strictness, enabledCategories, inputGuardEnabled]);

  const outputResult = useMemo(() => {
    if (!scenario) return null;
    return evaluateOutputGuard(
      scenario,
      strictness,
      enabledCategories,
      outputGuardEnabled,
    );
  }, [scenario, strictness, enabledCategories, outputGuardEnabled]);

  if (!scenario) return null;

  return (
    <div className="space-y-6">
      {/* Pipeline diagram */}
      <GuardrailsPipeline
        inputResult={inputResult}
        outputResult={outputResult}
        inputGuardEnabled={inputGuardEnabled}
        outputGuardEnabled={outputGuardEnabled}
      />

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr_280px] lg:grid-cols-[1fr_1fr_320px]">
        {/* Column 1: Input Guard Panel */}
        <div className="min-w-0">
          <GuardInputPanel
            scenario={scenario}
            inputResult={inputResult}
            inputGuardEnabled={inputGuardEnabled}
            strictness={strictness}
            enabledCategories={enabledCategories}
          />
        </div>

        {/* Column 2: Output Guard Panel */}
        <div className="min-w-0">
          <GuardOutputPanel
            scenario={scenario}
            outputResult={outputResult}
            outputGuardEnabled={outputGuardEnabled}
            strictness={strictness}
            enabledCategories={enabledCategories}
          />
        </div>

        {/* Column 3: Controls */}
        <div className="space-y-4">
          <GuardrailsControls />
        </div>
      </div>
    </div>
  );
}
