"use client";

import { useTranslations } from "next-intl";
import { useMCPStore } from "@/store/mcp-store";
import { queryExamples } from "@/lib/simulation/mcp";
import { ControlPanel } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

const presets = [
  {
    id: "good-discovery",
    title: "Good discovery",
    description: "Clear tool descriptions, correct tool selected, successful execution.",
  },
  {
    id: "bad-descriptions",
    title: "Bad descriptions",
    description: "Vague tool descriptions cause wrong tool selection.",
  },
  {
    id: "tool-error",
    title: "Tool error",
    description: "The selected tool returns an error — AI must handle it gracefully.",
  },
  {
    id: "unreachable",
    title: "Unreachable server",
    description: "The MCP server is not available — discovery fails at step 1.",
  },
];

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-discovery": return tp("goodDiscovery");
    case "bad-descriptions": return tp("badDescriptions");
    case "tool-error": return tp("toolError");
    case "unreachable": return tp("unreachable");
    default: return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-discovery": return tp("goodDiscoveryDesc");
    case "bad-descriptions": return tp("badDescriptionsDesc");
    case "tool-error": return tp("toolErrorDesc");
    case "unreachable": return tp("unreachableDesc");
    default: return "";
  }
}

export function MCPControls() {
  const t = useTranslations("MCP.controls");
  const tq = useTranslations("MCP.queries");
  const tp = useTranslations("MCP.presets");
  const tShared = useTranslations("Shared");

  const {
    selectedServerId,
    selectedQuery,
    discoveryStep,
    showDiscovery,
    useVagueDescriptions,
    simulateError,
    selectedPreset,
    setQuery,
    runDiscovery,
    callTool,
    reset,
    setShowDiscovery,
    setUseVagueDescriptions,
    setSimulateError,
    applyPreset,
  } = useMCPStore();

  const filteredQueries = queryExamples.filter((q) => q.serverId === selectedServerId);
  const canCallTool = discoveryStep === "tool_selected";
  const isExecuted = discoveryStep === "executed";

  const presetItems = presets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  return (
    <div className="space-y-4">
      {/* Run Discovery */}
      <ControlPanel title={t("discoveryTitle")}>
        <div className="space-y-3">
          <button
            onClick={runDiscovery}
            disabled={discoveryStep !== "idle"}
            className={`w-full rounded-md border px-4 py-2.5 text-[12px] font-mono font-medium transition-all ${
              discoveryStep !== "idle"
                ? "border-border bg-surface-elevated text-muted cursor-not-allowed opacity-60"
                : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/60"
            }`}
          >
            {discoveryStep !== "idle" ? t("discovered") : t("runDiscovery")}
          </button>

          <button
            onClick={callTool}
            disabled={!canCallTool}
            className={`w-full rounded-md border px-4 py-2.5 text-[12px] font-mono font-medium transition-all ${
              !canCallTool
                ? "border-border bg-surface-elevated text-muted cursor-not-allowed opacity-60"
                : "border-success/40 bg-success/10 text-success hover:bg-success/20 hover:border-success/60"
            }`}
          >
            {isExecuted ? t("executed") : t("callTool")}
          </button>

          <button
            onClick={reset}
            className="w-full rounded-md border border-border bg-surface-elevated px-4 py-2 text-[11px] font-medium text-secondary hover:border-border-hover hover:text-primary transition-colors"
          >
            {t("reset")}
          </button>
        </div>
      </ControlPanel>

      {/* Query selector */}
      <ControlPanel title={t("query")}>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {filteredQueries.map((q) => (
            <button
              key={q.id}
              onClick={() => setQuery(q.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                selectedQuery === q.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block line-clamp-2">{tq(q.id)}</span>
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Failure modes */}
      <ControlPanel title={tShared("failureModes")}>
        <div className="space-y-2">
          <ToggleRow
            label={t("vagueDescriptions")}
            description={t("vagueDescriptionsDesc")}
            active={useVagueDescriptions}
            onChange={setUseVagueDescriptions}
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

      {/* Show discovery toggle */}
      <ControlPanel title={t("display")}>
        <button
          onClick={() => setShowDiscovery(!showDiscovery)}
          className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
            showDiscovery
              ? "border-accent/30 bg-accent/[0.05]"
              : "border-border bg-surface hover:border-border-hover"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-secondary">
              {t("showDiscovery")}
            </span>
            <span className={`shrink-0 text-[10px] font-mono ${showDiscovery ? "text-accent" : "text-muted"}`}>
              {showDiscovery ? t("visible") : t("hidden")}
            </span>
          </div>
        </button>
      </ControlPanel>

      {/* Presets */}
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
