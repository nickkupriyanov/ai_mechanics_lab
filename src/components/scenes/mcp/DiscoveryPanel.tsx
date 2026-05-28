"use client";

import { useTranslations, useLocale } from "next-intl";
import type { MCPServer, MCPTool } from "@/lib/simulation/mcp";

type DiscoveryPanelProps = {
  server: MCPServer;
  discoveryStep: string;
  showDiscovery: boolean;
  selectedTool: { tool: MCPTool; score: number } | null;
  generatedArgs: Record<string, string>;
  toolResult: { success: boolean; output: string; error?: string } | null;
  useVagueDescriptions: boolean;
};

export function DiscoveryPanel({
  server,
  discoveryStep,
  showDiscovery,
  selectedTool,
  generatedArgs,
  toolResult,
  useVagueDescriptions,
}: DiscoveryPanelProps) {
  const t = useTranslations("MCP.discovery");
  const locale = useLocale();

  if (!showDiscovery) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("title")}
          </span>
        </div>
        <div className="flex min-h-[120px] items-center justify-center p-6">
          <p className="text-[12px] text-muted text-center">
            {t("idleHint")}
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: "listening",
      label: t("step1Label"),
      detail: locale === "ru"
        ? `AI-клиент (например, Claude Desktop, Cursor) отправляет запрос на получение списка доступных инструментов от MCP-сервера. Это рукопожатие обнаружения.`
        : `The AI client (e.g. Claude Desktop, Cursor) sends a request to list available tools from the MCP server. This is the discovery handshake.`,
      icon: "📡",
      status: discoveryStep === "idle" ? "pending" : "done",
    },
    {
      id: "discovered",
      label: t("step2Label", { server: server.name }),
      detail: locale === "ru"
        ? `Сервер отвечает с ${server.tools.length} доступными инструментами: ${server.tools.map(tool => tool.name).join(", ")}. Каждый инструмент включает имя, описание и схему параметров.`
        : `The server responds with ${server.tools.length} available tools: ${server.tools.map(tool => tool.name).join(", ")}. Each tool includes name, description, and parameter schema.`,
      icon: server.icon,
      status: discoveryStep === "idle" || discoveryStep === "listening" ? "pending"
        : discoveryStep === "discovered" ? "active" : "done",
    },
    {
      id: "tool_selected",
      label: selectedTool
        ? t("step3LabelWithTool", { tool: selectedTool.tool.name })
        : t("step3Label"),
      detail: selectedTool
        ? (locale === "ru"
          ? `AI выбрал инструмент ${selectedTool.tool.name} (оценка уверенности: ${selectedTool.score}) на основе запроса пользователя.`
          : `The AI selected ${selectedTool.tool.name} (confidence score: ${selectedTool.score}) based on the user's request.`)
        : t("step3Hint"),
      icon: "🎯",
      status: discoveryStep === "idle" || discoveryStep === "listening" || discoveryStep === "discovered"
        ? "pending" : "done",
    },
    {
      id: "executed",
      label: toolResult
        ? (toolResult.success ? t("step4LabelSuccess") : t("step4LabelError"))
        : t("step4Label"),
      detail: toolResult
        ? (toolResult.success
          ? (locale === "ru" ? "MCP-сервер выполнил инструмент и вернул структурированный результат." : "The MCP server executed the tool and returned a structured result.")
          : (locale === "ru" ? "Инструмент завершился с ошибкой. AI должен её обработать." : "The tool failed with an error. The AI must handle it gracefully."))
        : t("step4Hint"),
      icon: toolResult ? (toolResult.success ? "✅" : "❌") : "⏳",
      status: discoveryStep === "executed"
        ? (toolResult?.success ? "done" : "error")
        : "pending",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-px bg-border" />

          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.id} className="relative flex gap-4">
                {/* Circle indicator */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                    step.status === "done"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : step.status === "active"
                      ? "border-accent bg-accent/20 text-accent"
                      : step.status === "error"
                      ? "border-danger/40 bg-danger/10 text-danger"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  {step.icon}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p
                    className={`text-[13px] font-medium leading-snug ${
                      step.status === "pending" ? "text-muted" : "text-primary"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    {step.detail}
                  </p>

                  {/* Show tool args for step 3 */}
                  {step.id === "tool_selected" && selectedTool && Object.keys(generatedArgs).length > 0 && (
                    <div className="mt-2 rounded-md border border-border bg-surface-elevated p-2.5 font-mono text-[11px] leading-relaxed">
                      <span className="text-muted/60">{"{"}</span>
                      {Object.entries(generatedArgs).map(([key, value], i, arr) => (
                        <div key={key} className="pl-3">
                          <span className="text-info">&quot;{key}&quot;</span>
                          <span className="text-muted">: </span>
                          <span className="text-success">&quot;{String(value).slice(0, 60)}&quot;</span>
                          {i < arr.length - 1 && <span className="text-muted">,</span>}
                        </div>
                      ))}
                      <span className="text-muted/60">{"}"}</span>
                    </div>
                  )}

                  {/* Show tool result for step 4 */}
                  {step.id === "executed" && toolResult && (
                    <div className={`mt-2 rounded-md border p-2.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all ${
                      toolResult.success ? "border-success/20 bg-success/[0.03]" : "border-danger/20 bg-danger/[0.03]"
                    }`}>
                      {toolResult.success ? (
                        <span className="text-secondary">{toolResult.output.slice(0, 300)}</span>
                      ) : (
                        <span className="text-danger">{toolResult.error}</span>
                      )}
                    </div>
                  )}

                  {useVagueDescriptions && step.id === "tool_selected" && (
                    <div className="mt-2 rounded border border-warning/20 bg-warning/[0.03] px-2.5 py-1.5">
                      <p className="text-[10px] text-warning/80">
                        {locale === "ru"
                          ? "Расплывчатые описания инструментов могут привести к неверному выбору."
                          : "Vague tool descriptions can lead to incorrect tool selection."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failure mode hint */}
        {selectedTool && !selectedTool.tool.params.some(p => Object.keys(generatedArgs).includes(p.name) && generatedArgs[p.name]) && discoveryStep === "tool_selected" && (
          <div className="mt-4 rounded-md border border-danger/10 bg-danger/[0.02] p-3">
            <p className="text-[11px] text-danger/70">
              {useVagueDescriptions
                ? (locale === "ru"
                  ? "Плохие описания привели к выбору инструмента без заполнения аргументов — параметры не были извлечены."
                  : "Bad descriptions caused a tool selection without argument extraction — required parameters were not filled.")
                : (locale === "ru"
                  ? "Не удалось извлечь обязательные аргументы для выбранного инструмента."
                  : "Could not extract required arguments for the selected tool.")
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
