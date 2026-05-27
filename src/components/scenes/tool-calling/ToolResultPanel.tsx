"use client";

import { useTranslations } from "next-intl";
import type { ToolCallResult } from "@/lib/simulation/tool-calling";

type ToolResultPanelProps = {
  result: ToolCallResult | null;
  requireApproval: boolean;
  approved: boolean;
  onApprove: () => void;
};

export function ToolResultPanel({
  result,
  requireApproval,
  approved,
  onApprove,
}: ToolResultPanelProps) {
  const t = useTranslations("ToolCalling.result");
  const tShared = useTranslations("Shared");

  if (!result) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("title")}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 py-10 text-[12px] text-muted">
          {t("selectFirst")}
        </div>
      </div>
    );
  }

  const isError = !result.success;

  return (
    <div
      className={`rounded-lg border bg-surface ${
        isError ? "border-danger/30" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span
          className={`text-[10px] font-mono font-medium ${
            isError ? "text-danger" : "text-success"
          }`}
        >
          {isError ? t("error") : t("success")}
        </span>
      </div>

      {/* Approval step */}
      {requireApproval && !isError && (
        <div className="border-b border-warning/20 bg-warning/[0.03] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-warning">
                {tShared("approvalRequired")}
              </p>
              <p className="text-[10px] text-muted mt-0.5">
                {result.toolName === "send_email" ? t("approveAction") : t("approveActionGeneric")}
              </p>
            </div>
            {!approved ? (
              <button
                onClick={onApprove}
                className="shrink-0 rounded-md bg-success/20 border border-success/30 px-3 py-1.5 text-[12px] font-medium text-success hover:bg-success/30 transition-colors"
              >
                {tShared("approve")}
              </button>
            ) : (
              <span className="shrink-0 rounded border border-success/30 px-3 py-1.5 text-[12px] font-medium text-success">
                {tShared("approved")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Output */}
      <div className="p-4">
        {isError ? (
          <div className="rounded-md border border-danger/20 bg-danger/[0.03] p-3">
            <p className="mb-1 text-[11px] font-mono font-medium text-danger">
              {t("errorTitle")}
            </p>
            <p className="text-[11px] leading-relaxed text-danger/80">
              {result.error}
            </p>
          </div>
        ) : requireApproval && !approved ? (
          <div className="text-center py-4">
            <p className="text-[12px] text-muted">
              {tShared("waitingApproval")}
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-surface-elevated p-3">
            <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-secondary font-mono">
              {result.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
