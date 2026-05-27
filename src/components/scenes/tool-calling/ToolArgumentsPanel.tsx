"use client";

import { useTranslations } from "next-intl";
import type { Tool } from "@/lib/simulation/tool-calling";

type ToolArgumentsPanelProps = {
  tool: Tool;
  args: Record<string, string>;
};

export function ToolArgumentsPanel({ tool, args }: ToolArgumentsPanelProps) {
  const t = useTranslations("ToolCalling.arguments");
  const argEntries = Object.entries(args);
  const hasAllRequired = tool.parameters
    .filter((p) => p.required)
    .every((p) => args[p.name] && args[p.name].length > 0);

  const missingParams = tool.parameters
    .filter((p) => p.required && !args[p.name])
    .map((p) => p.name)
    .join(", ");

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {tool.name}
        </span>
      </div>
      <div className="p-4">
        {argEntries.length === 0 ? (
          <p className="text-[12px] text-muted text-center py-4">{t("noArgs")}</p>
        ) : (
          <div className="space-y-0">
            <div className="rounded-md border border-border bg-surface-elevated p-3 font-mono text-[12px] leading-relaxed">
              <span className="text-muted/60">{"{"}</span>
              {argEntries.map(([key, value], i) => (
                <div key={key} className="pl-4">
                  <span className="text-info">&quot;{key}&quot;</span>
                  <span className="text-muted">: </span>
                  <span className="text-success">&quot;{value}&quot;</span>
                  {i < argEntries.length - 1 && <span className="text-muted">,</span>}
                </div>
              ))}
              <span className="text-muted/60">{"}"}</span>
            </div>
          </div>
        )}

        {/* Missing required */}
        {!hasAllRequired && (
          <div className="mt-3 rounded-md border border-danger/20 bg-danger/[0.03] p-2.5">
            <p className="text-[11px] text-danger/80">
              {t("missingRequired", { params: missingParams })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
