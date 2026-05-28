"use client";

import { useTranslations, useLocale } from "next-intl";
import { mcpServers } from "@/lib/simulation/mcp";

type ServerListProps = {
  selectedServerId: string;
  discoveryStep: string;
  onSelect: (serverId: string) => void;
};

export function ServerList({ selectedServerId, onSelect }: ServerListProps) {
  const t = useTranslations("MCP.servers");
  const locale = useLocale();

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {mcpServers.length} {t("available")}
        </span>
      </div>
      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {mcpServers.map((server) => {
            const isSelected = server.id === selectedServerId;

            return (
              <button
                key={server.id}
                onClick={() => onSelect(server.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all text-[10px] ${
                  isSelected
                    ? "border-accent/40 bg-accent/10 shadow-sm"
                    : "border-border bg-surface-elevated hover:border-border-hover hover:bg-surface-hover"
                }`}
                style={
                  isSelected
                    ? { borderColor: `${server.color}80`, boxShadow: `0 0 12px ${server.color}15` }
                    : {}
                }
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
                  style={{
                    borderColor: isSelected ? `${server.color}80` : "var(--color-border)",
                    backgroundColor: isSelected ? `${server.color}15` : "var(--color-surface)",
                  }}
                >
                  <span className="text-2xl">{server.icon}</span>
                </div>
                <span
                  className="font-mono text-[13px] font-semibold transition-colors"
                  style={{ color: isSelected ? "var(--color-primary)" : "var(--color-secondary)" }}
                >
                  {server.name}
                </span>
                <p className="text-[11px] leading-relaxed text-muted line-clamp-2">
                  {locale === "ru" ? server.descriptionRu : server.description}
                </p>
                <span
                  className="rounded-full border px-2 py-0.5 text-[9px] font-mono"
                  style={{
                    borderColor: isSelected ? `${server.color}40` : "var(--color-border)",
                    color: isSelected ? "var(--color-accent)" : "var(--color-muted)",
                  }}
                >
                  {server.tools.length} {t("tools")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
