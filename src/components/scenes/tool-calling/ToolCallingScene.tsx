"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useToolCallingStore } from "@/store/tool-calling-store";
import {
  tools,
  similarTool,
  userRequests,
  selectTool,
  generateArgs,
  executeTool,
} from "@/lib/simulation/tool-calling";
import { ToolList } from "./ToolList";
import { ToolArgumentsPanel } from "./ToolArgumentsPanel";
import { ToolResultPanel } from "./ToolResultPanel";
import { ToolCallingControls } from "./ToolCallingControls";

export function ToolCallingScene() {
  const t = useTranslations("ToolCalling.pipeline");
  const tc = useTranslations("ToolCalling.controls");
  const tData = useTranslations("ToolCallingData");
  const locale = useLocale();

  const {
    userQuery,
    useBadDescriptions,
    requireApproval,
    simulateError,
    enableSimilarTools,
    approved,
    setApproved,
  } = useToolCallingStore();

  const availableTools = useMemo(() => {
    const isRu = locale === "ru";
    const base = tools.map((t) => ({
      ...t,
      description: useBadDescriptions
        ? (isRu ? t.badDescriptionRu : t.badDescription)
        : (isRu ? t.descriptionRu : t.description),
    }));
    if (enableSimilarTools) {
      const s = { ...similarTool };
      s.description = useBadDescriptions
        ? (isRu ? s.badDescriptionRu : s.badDescription)
        : (isRu ? s.descriptionRu : s.description);
      base.push(s);
    }
    return base;
  }, [useBadDescriptions, enableSimilarTools, locale]);

  const { selectedTool, scoreMap } = useMemo(() => {
    const map = new Map<string, number>();
    availableTools.forEach((t) => {
      const { score } = selectTool(userQuery, [t]);
      map.set(t.id, score);
    });
    const top = selectTool(userQuery, availableTools);
    return { selectedTool: top.tool, scoreMap: map };
  }, [userQuery, availableTools]);

  const rawArgs = useMemo(
    () => generateArgs(selectedTool, userQuery),
    [selectedTool, userQuery],
  );

  const fallbackMap = useMemo(
    () => ({
      Unknown: tData("fallbackArgs.unknownCity"),
      Update: tData("fallbackArgs.defaultSubject"),
      "The new version has been deployed and is now live.": tData("fallbackArgs.defaultBody"),
      "Here is the information you requested.": tData("fallbackArgs.defaultBodyGeneric"),
      "Users unable to log in — Invalid session token error": tData("fallbackArgs.defaultTicketTitle"),
      "Issue reported by user": tData("fallbackArgs.defaultTicketTitleGeneric"),
      "After the latest update, users report getting 'Invalid session token' error when trying to log in.": tData("fallbackArgs.defaultTicketDesc"),
      "User reported an issue that needs investigation.": tData("fallbackArgs.defaultTicketDescGeneric"),
      high: tData("fallbackArgs.high"),
      medium: tData("fallbackArgs.medium"),
      "/documents": tData("fallbackArgs.defaultPath"),
    }),
    [tData],
  );

  const args = useMemo(() => {
    const translated: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawArgs)) {
      translated[key] = fallbackMap[value as keyof typeof fallbackMap] ?? value;
    }
    return translated;
  }, [rawArgs, fallbackMap]);

  const rawResult = useMemo(() => {
    const shouldRun = !requireApproval || (requireApproval && approved);
    if (!shouldRun) return null;
    return executeTool(selectedTool.id, args, simulateError);
  }, [selectedTool, args, simulateError, requireApproval, approved]);

  const result = useMemo(() => {
    if (!rawResult) return null;
    if (!rawResult.success) {
      const errorKey = `errorMessages.${rawResult.toolId}`;
      return { ...rawResult, error: tData(errorKey) };
    }
    return rawResult;
  }, [rawResult, tData]);

  const displayQuery = useMemo(() => {
    const req = userRequests.find(
      (r) => r.query === userQuery || r.queryRu === userQuery,
    );
    return locale === "ru" ? (req?.queryRu ?? userQuery) : userQuery;
  }, [userQuery, locale]);

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="rounded-lg border border-border bg-surface px-2 py-3">
        <div className="flex items-center justify-center gap-0 overflow-x-auto">
          {[
            { label: t("request"), value: t("received"), active: true },
            { label: t("toolSelection"), value: selectedTool.name, active: true },
            { label: t("arguments"), value: t("generated"), active: true },
            {
              label: requireApproval ? t("approval") : t("execution"),
              value: requireApproval ? (approved ? t("approved") : t("pending")) : (simulateError ? t("error") : t("success")),
              active: requireApproval ? approved : true,
            },
            { label: t("result"), value: result ? (result.success ? t("returned") : t("error")) : t("waiting"), active: !!result },
          ].map((stage, i, arr) => (
            <div key={stage.label} className="flex items-center shrink-0">
              <div
                className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[80px] transition-colors ${
                  stage.active
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-surface-hover border border-border opacity-50"
                }`}
              >
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-accent">
                  {stage.label}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-primary truncate max-w-[80px]">
                  {stage.value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <svg className="mx-1 h-3 w-4 shrink-0 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 min-w-0">
          {/* User request */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-4 py-2.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                {tc("userRequest")}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[13px] leading-relaxed text-primary">{displayQuery}</p>
            </div>
          </div>

          <ToolList
            tools={availableTools}
            selectedToolId={selectedTool.id}
            scoreMap={scoreMap}
            useBadDescriptions={useBadDescriptions}
          />

          <ToolArgumentsPanel tool={selectedTool} args={args} />

          <ToolResultPanel
            result={result}
            requireApproval={requireApproval}
            approved={approved}
            onApprove={() => setApproved(true)}
          />
        </div>

        <div className="space-y-4">
          <ToolCallingControls />
        </div>
      </div>
    </div>
  );
}
