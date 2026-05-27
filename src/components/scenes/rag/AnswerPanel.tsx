"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type AnswerPanelProps = {
  answer: string;
  query: string;
  quality?: "good" | "low";
};

export function AnswerPanel({ answer, query, quality }: AnswerPanelProps) {
  const t = useTranslations("Rag.answer");

  const isLowQuality = quality === "low";

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-3 rounded-md border border-border bg-surface-elevated p-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("userQuery")}
          </span>
          <p className="mt-1 text-sm text-primary">{query}</p>
        </div>

        <div
          className={`rounded-md border p-4 ${
            isLowQuality
              ? "border-warning/20 bg-warning/[0.03]"
              : "border-success/20 bg-success/[0.03]"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-medium uppercase tracking-wider ${
                isLowQuality ? "text-warning" : "text-success"
              }`}
            >
              {isLowQuality ? t("lowQuality") : t("answer")}
            </span>
            {isLowQuality && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded border border-warning/30 px-1 py-0.5 text-[9px] font-mono text-warning"
              >
                {t("degraded")}
              </motion.span>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={answer.slice(0, 40)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-[13px] leading-relaxed text-secondary"
            >
              {answer}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
