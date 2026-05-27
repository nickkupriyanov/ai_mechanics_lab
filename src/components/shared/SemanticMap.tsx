"use client";

import { useTranslations } from "next-intl";
import type { Phrase } from "@/lib/simulation/embeddings";
import { topicClusters } from "@/lib/simulation/embeddings";

type SemanticMapProps = {
  phrases: Phrase[];
  highlightedIds?: string[];
  queryId?: string;
  neighborIds?: string[];
  onPhraseClick?: (id: string) => void;
  showLabels?: boolean;
};

const PADDING = 40;
const AXIS_LABEL_SIZE = 20;

export function SemanticMap({
  phrases,
  highlightedIds = [],
  queryId,
  neighborIds = [],
  onPhraseClick,
  showLabels = true,
}: SemanticMapProps) {
  const t = useTranslations("Shared");
  const tEmb = useTranslations("Embeddings");
  const width = 600;
  const height = 450;
  const plotW = width - PADDING * 2 - AXIS_LABEL_SIZE;
  const plotH = height - PADDING * 2 - AXIS_LABEL_SIZE;

  const toSvg = (px: number, py: number) => ({
    x: PADDING + AXIS_LABEL_SIZE + px * plotW,
    y: height - PADDING - py * plotH,
  });

  const clusterColors = new Map(topicClusters.map((c) => [c.id, c.color]));
  const phraseMap = new Map(phrases.map((p) => [p.id, p]));

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("semanticSpace")}{" "}
          <span className="text-muted/50">— {t("semanticSpaceHint")}</span>
        </span>
      </div>
      <div className="p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          {/* Background grid */}
          {Array.from({ length: 6 }).map((_, i) => {
            const t = i / 5;
            const y = PADDING + AXIS_LABEL_SIZE + t * plotH;
            return (
              <g key={`grid-h-${i}`}>
                <line
                  x1={PADDING + AXIS_LABEL_SIZE}
                  y1={y}
                  x2={width - PADDING}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth={0.5}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <text
                  x={PADDING + AXIS_LABEL_SIZE - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                >
                  {(t * 100).toFixed(0)}
                </text>
              </g>
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => {
            const t = i / 5;
            const x = PADDING + AXIS_LABEL_SIZE + t * plotW;
            return (
              <g key={`grid-v-${i}`}>
                <line
                  x1={x}
                  y1={PADDING}
                  x2={x}
                  y2={height - PADDING}
                  stroke="var(--color-border)"
                  strokeWidth={0.5}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <text
                  x={x}
                  y={height - PADDING + 12}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                >
                  {(t * 100).toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Topic clusters (ellipse backgrounds) */}
          {topicClusters.map((cluster) => {
            const clusterPhrases = phrases.filter((p) => p.topic === cluster.id);
            if (clusterPhrases.length === 0) return null;
            const cx =
              clusterPhrases.reduce((s, p) => s + p.x, 0) / clusterPhrases.length;
            const cy =
              clusterPhrases.reduce((s, p) => s + p.y, 0) / clusterPhrases.length;
            const rx =
              Math.max(...clusterPhrases.map((p) => Math.abs(p.x - cx)), 0.06) + 0.04;
            const ry =
              Math.max(...clusterPhrases.map((p) => Math.abs(p.y - cy)), 0.06) + 0.04;
            const c = toSvg(cx, cy);
            return (
              <ellipse
                key={cluster.id}
                cx={c.x}
                cy={c.y}
                rx={rx * plotW}
                ry={ry * plotH}
                fill={cluster.color}
                opacity={0.06}
                stroke={cluster.color}
                strokeWidth={1}
                strokeOpacity={0.15}
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Neighbor connections from query */}
          {queryId && neighborIds.length > 0 && (() => {
            const q = phraseMap.get(queryId);
            if (!q) return null;
            const qp = toSvg(q.x, q.y);
            return neighborIds.map((nid) => {
              const n = phraseMap.get(nid);
              if (!n) return null;
              const np = toSvg(n.x, n.y);
              return (
                <line
                  key={`conn-${nid}`}
                  x1={qp.x}
                  y1={qp.y}
                  x2={np.x}
                  y2={np.y}
                  stroke="var(--color-accent)"
                  strokeWidth={1}
                  strokeDasharray="3 2"
                  opacity={0.4}
                />
              );
            });
          })()}

          {/* Connection between selected pair */}
          {!queryId && highlightedIds.length === 2 && (() => {
            const a = phraseMap.get(highlightedIds[0]);
            const b = phraseMap.get(highlightedIds[1]);
            if (!a || !b) return null;
            const ap = toSvg(a.x, a.y);
            const bp = toSvg(b.x, b.y);
            return (
              <line
                x1={ap.x}
                y1={ap.y}
                x2={bp.x}
                y2={bp.y}
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                opacity={0.6}
              />
            );
          })()}

          {/* Phrase points */}
          {phrases.map((phrase) => {
            const p = toSvg(phrase.x, phrase.y);
            const color = clusterColors.get(phrase.topic) || "#63636e";
            const isHighlighted = highlightedIds.includes(phrase.id);
            const isQuery = queryId === phrase.id;
            const isNeighbor = neighborIds.includes(phrase.id);
            const baseR = isQuery ? 6 : isHighlighted ? 5 : isNeighbor ? 4.5 : 3.5;
            const r = isQuery ? 7 : isHighlighted ? 5.5 : isNeighbor ? 5 : 3.5;
            const opacity = highlightedIds.length > 0
              ? isHighlighted || isQuery || neighborIds.length > 0
                ? 1
                : 0.25
              : 0.8;

            return (
              <g
                key={phrase.id}
                onClick={() => onPhraseClick?.(phrase.id)}
                className={onPhraseClick ? "cursor-pointer" : ""}
                opacity={opacity}
              >
                {isQuery && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + 4}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={1.5}
                    opacity={0.5}
                  >
                    <animate
                      attributeName="r"
                      from={r + 4}
                      to={r + 7}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={baseR}
                  fill={color}
                  stroke={isHighlighted || isQuery ? "var(--color-primary)" : color}
                  strokeWidth={isHighlighted || isQuery ? 1.5 : 0}
                  opacity={isNeighbor ? 0.9 : 1}
                />
                {showLabels && (
                  <foreignObject
                    x={p.x - 50}
                    y={p.y + 8}
                    width="100"
                    height="28"
                    className="overflow-visible"
                  >
                    <div className="text-center">
                      <span
                        className="inline-block rounded border px-1.5 py-0.5 text-[9px] font-mono leading-tight"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: isHighlighted || isQuery ? "var(--color-accent)" : "var(--color-border)",
                          color: isHighlighted || isQuery ? "var(--color-primary)" : "var(--color-muted)",
                          maxWidth: "96px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {phrase.text}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-2">
        {topicClusters.map((c) => (
          <div key={c.id} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            <span className="text-[10px] font-mono text-muted">{tEmb(`topic_${c.id}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
