"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useContextWindowStore } from "@/store/context-window-store";
import { buildContext, type ContextBlock } from "@/lib/simulation/context-window";
import { ContextMeter } from "./ContextMeter";
import { TokenBlock } from "./TokenBlock";
import { ContextControls } from "./ContextControls";

export function ContextWindowScene() {
  const t = useTranslations("ContextWindow");
  const tShared = useTranslations("Shared");
  const tData = useTranslations("ContextWindowData");
  const { contextSize, historyCount, noiseCount, enableSummarization } =
    useContextWindowStore();

  const ctx = useMemo(
    () => buildContext(contextSize, historyCount, noiseCount, enableSummarization),
    [contextSize, historyCount, noiseCount, enableSummarization],
  );

  const translateBlock = useCallback(
    (block: ContextBlock): ContextBlock => {
      try {
        switch (block.type) {
          case "system":
            return {
              ...block,
              label: tData("systemPrompt.label"),
              content: tData("systemPrompt.content"),
            };
          case "history":
            if (block.id === "history-summary") {
              return {
                ...block,
                label: t("summarized"),
                content: tData("summarized", { count: historyCount }),
              };
            }
            return {
              ...block,
              content: tData(`history.${block.id}`),
            };
          case "retrieved":
            return {
              ...block,
              label: tData(`retrieved.${block.id}.label`),
              content: tData(`retrieved.${block.id}.content`),
            };
          case "noise":
            return {
              ...block,
              content: tData(`noise.${block.id}`),
            };
          case "tools":
            return {
              ...block,
              label: tData("toolResult.label"),
            };
          case "memory":
            return {
              ...block,
              label: tData("memory.label"),
              content: tData("memory.content"),
            };
          case "query":
            return {
              ...block,
              content: tData("userQuery"),
            };
          default:
            return block;
        }
      } catch {
        return block;
      }
    },
    [tData, t, historyCount],
  );

  const translatedCtx = useMemo(
    () => ({
      ...ctx,
      fittingBlocks: ctx.fittingBlocks.map(translateBlock),
      excludedBlocks: ctx.excludedBlocks.map(translateBlock),
    }),
    [ctx, translateBlock],
  );

  const promptText = useMemo(() => {
    return translatedCtx.fittingBlocks
      .map((b) => `[${b.label}]\n${b.content}`)
      .join("\n\n");
  }, [translatedCtx]);

  return (
    <div className="space-y-6">
      <ContextMeter
        fittingBlocks={translatedCtx.fittingBlocks}
        excludedBlocks={translatedCtx.excludedBlocks}
        tokensUsed={translatedCtx.tokensUsed}
        contextSize={translatedCtx.contextSize}
        hasEssentialExcluded={translatedCtx.hasEssentialExcluded}
      />

      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        {/* Left: block stack */}
        <div className="space-y-4 min-w-0">
          {/* Fitting blocks */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                {t("inContext", { count: translatedCtx.fittingBlocks.length })}
              </span>
              <span className="text-[10px] font-mono text-success">
                {t("tokensUsedLabel", { n: translatedCtx.tokensUsed })}
              </span>
            </div>
            <div className="max-h-[440px] space-y-2 overflow-y-auto p-4">
              {translatedCtx.fittingBlocks.map((block) => (
                <TokenBlock key={block.id} block={block} />
              ))}
            </div>
          </div>

          {/* Excluded blocks */}
          {translatedCtx.excludedBlocks.length > 0 && (
            <div className="rounded-lg border border-danger/20 bg-danger/[0.02]">
              <div className="flex items-center justify-between border-b border-danger/10 px-4 py-2.5">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-danger">
                  {t("excluded", { count: translatedCtx.excludedBlocks.length })}
                </span>
                <span className="text-[10px] font-mono text-danger/70">
                  {t("overCapacity")}
                </span>
              </div>
              <div className="space-y-2 p-4">
                {translatedCtx.excludedBlocks.map((block) => (
                  <TokenBlock key={block.id} block={block} excluded />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: controls + preview */}
        <div className="space-y-4">
          <ContextControls />

          {/* Prompt preview */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                {t("finalPrompt")}
              </span>
              <span className="text-[10px] font-mono text-muted">
                ~{translatedCtx.tokensUsed}{" "}{tShared("tokensUnit")}
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4">
              <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-secondary font-mono">
                {translatedCtx.fittingBlocks.length === 0 ? (
                  <span className="text-muted">{t("noFit")}</span>
                ) : (
                  promptText.length > 1200
                    ? promptText.slice(0, 1200) + (
                        <span className="text-muted">{"\n\n"}{tShared("truncated")}</span>
                      )
                    : promptText
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
