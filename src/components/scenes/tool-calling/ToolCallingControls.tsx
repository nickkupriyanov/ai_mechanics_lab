"use client";

import { useTranslations } from "next-intl";
import { useToolCallingStore } from "@/store/tool-calling-store";
import { userRequests, toolCallingPresets } from "@/lib/simulation/tool-calling";
import { ControlPanel } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-tool-call": return tp("goodToolCall");
    case "bad-description": return tp("badDescription");
    case "similar-tools": return tp("similarTools");
    case "need-approval": return tp("needApproval");
    case "tool-error": return tp("toolError");
    default: return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-tool-call": return tp("goodToolCallDesc");
    case "bad-description": return tp("badDescriptionDesc");
    case "similar-tools": return tp("similarToolsDesc");
    case "need-approval": return tp("needApprovalDesc");
    case "tool-error": return tp("toolErrorDesc");
    default: return "";
  }
}

export function ToolCallingControls() {
  const t = useTranslations("ToolCalling.controls");
  const tp = useTranslations("ToolCalling.presets");
  const tShared = useTranslations("Shared");

  const {
    userQuery,
    useBadDescriptions,
    requireApproval,
    simulateError,
    enableSimilarTools,
    selectedPreset,
    setUserQuery,
    setUseBadDescriptions,
    setRequireApproval,
    setSimulateError,
    setEnableSimilarTools,
    applyPreset,
  } = useToolCallingStore();

  const presetItems = toolCallingPresets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  return (
    <div className="space-y-4">
      <ControlPanel title={t("userRequest")}>
        <div className="space-y-1 max-h-[220px] overflow-y-auto">
          {userRequests.map((req) => (
            <button
              key={req.id}
              onClick={() => setUserQuery(req.query)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                userQuery === req.query
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block line-clamp-2">{req.label}</span>
            </button>
          ))}
        </div>
      </ControlPanel>

      <ControlPanel title={tShared("failureModes")}>
        <div className="space-y-2">
          <ToggleRow
            label={t("badDescriptions")}
            description={t("badDescriptionsDesc")}
            active={useBadDescriptions}
            onChange={setUseBadDescriptions}
            onLabel={t("on")}
            offLabel={t("off")}
          />
          <ToggleRow
            label={t("similarTools")}
            description={t("similarToolsDesc")}
            active={enableSimilarTools}
            onChange={setEnableSimilarTools}
            onLabel={t("on")}
            offLabel={t("off")}
          />
          <ToggleRow
            label={t("requireApproval")}
            description={t("requireApprovalDesc")}
            active={requireApproval}
            onChange={setRequireApproval}
            onLabel={t("on")}
            offLabel={t("off")}
          />
          <ToggleRow
            label={t("simulateError")}
            description={t("simulateErrorDesc")}
            active={simulateError}
            onChange={setSimulateError}
            onLabel={t("on")}
            offLabel={t("off")}
          />
        </div>
      </ControlPanel>

      <ControlPanel title={tShared("presets")}>
        <PresetSelector
          presets={presetItems}
          activePresetId={selectedPreset ?? undefined}
          onSelect={applyPreset}
        />
      </ControlPanel>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  active,
  onChange,
  onLabel,
  offLabel,
}: {
  label: string;
  description: string;
  active: boolean;
  onChange: (v: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
        active
          ? "border-warning/30 bg-warning/[0.05]"
          : "border-border bg-surface hover:border-border-hover"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[12px] font-medium ${active ? "text-warning" : "text-secondary"}`}>
          {label}
        </span>
        <span className={`shrink-0 text-[10px] font-mono ${active ? "text-warning" : "text-muted"}`}>
          {active ? onLabel : offLabel}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{description}</p>
    </button>
  );
}
