"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAgentsStore } from "@/store/agents-store";
import { agentScenarios } from "@/lib/simulation/agents";

const NODE_LABELS = [
  "goal",
  "plan",
  "toolCall",
  "observation",
  "reflection",
  "nextStep",
] as const;

const NODE_COLORS = [
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#a78bfa",
];

const NODE_ANGLES = [-90, -30, 30, 90, 150, 210];

const CX = 150;
const CY = 150;
const R = 115;
const NODE_R = 20;

function nodePosition(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

export function AgentLoop() {
  const t = useTranslations("Agents.pipeline");
  const locale = useLocale();

  const scenarioId = useAgentsStore((s) => s.scenarioId);
  const executedSteps = useAgentsStore((s) => s.executedSteps);
  const isDone = useAgentsStore((s) => s.isDone);
  const isStuck = useAgentsStore((s) => s.isStuck);
  const enableReflection = useAgentsStore((s) => s.enableReflection);

  const scenario = useMemo(
    () => agentScenarios.find((s) => s.id === scenarioId) ?? agentScenarios[0],
    [scenarioId],
  );

  const goalText =
    locale === "ru" ? scenario.goalRu : scenario.goal;

  const completedCount = executedSteps.length;

  const completedNodeIndices = useMemo(() => {
    const set = new Set<number>();
    if (completedCount > 0) set.add(0);
    for (let i = 0; i < completedCount; i++) {
      set.add(2);
      set.add(3);
      if (enableReflection) set.add(4);
    }
    if (isDone) {
      set.add(1);
      set.add(5);
    }
    return set;
  }, [completedCount, enableReflection, isDone]);

  const activeNodeIndex = useMemo(() => {
    if (isStuck) return 5;
    if (isDone) return -1;
    if (completedCount === 0) return 0;
    return 1;
  }, [isDone, isStuck, completedCount]);

  const nodePositions = NODE_ANGLES.map(nodePosition);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 300 320"
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arrows */}
        {NODE_ANGLES.map((angle, i) => {
          const nextI = (i + 1) % NODE_ANGLES.length;
          const from = nodePosition(angle);
          const to = nodePosition(NODE_ANGLES[nextI]);

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;

          const startX = from.x + nx * (NODE_R + 4);
          const startY = from.y + ny * (NODE_R + 4);
          const endX = to.x - nx * (NODE_R + 4);
          const endY = to.y - ny * (NODE_R + 4);

          const isCompleted =
            completedNodeIndices.has(i) && completedNodeIndices.has(nextI);

          return (
            <g key={`arrow-${i}`}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isCompleted ? "#22c55e" : "#374151"}
                strokeWidth={isCompleted ? 2 : 1.5}
                strokeDasharray={i === 5 && !isDone ? "6 3" : undefined}
                opacity={isCompleted ? 1 : 0.35}
              />
              <polygon
                points={`${endX},${endY} ${endX - nx * 7 - ny * 4},${endY - ny * 7 + nx * 4} ${endX - nx * 7 + ny * 4},${endY - ny * 7 - nx * 4}`}
                fill={isCompleted ? "#22c55e" : "#374151"}
                opacity={isCompleted ? 1 : 0.35}
              />
            </g>
          );
        })}

        {/* Center loop count */}
        {completedCount > 0 && (
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: "11px", fontFamily: "monospace" }}
          >
            {completedCount} / {isDone ? "✓" : "..."}
          </text>
        )}
        {completedCount === 0 && (
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: "10px", fontFamily: "monospace" }}
          >
            {locale === "ru" ? "Начать" : "Start"}
          </text>
        )}

        {isStuck && (
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            fill="#ef4444"
            style={{ fontSize: "10px", fontWeight: 700, fontFamily: "monospace" }}
          >
            {locale === "ru" ? "ЗАЦИКЛИЛСЯ" : "STUCK"}
          </text>
        )}

        {/* Nodes */}
        {NODE_LABELS.map((labelKey, i) => {
          const pos = nodePositions[i];
          const isActive = activeNodeIndex === i;
          const isCompleted = completedNodeIndices.has(i);
          const isReflectionDisabled = i === 4 && !enableReflection;

          let fillColor = "#1f2937";
          let strokeColor = "#374151";
          let textColor = "#6b7280";

          if (isReflectionDisabled) {
            fillColor = "#111827";
            strokeColor = "#1f2937";
            textColor = "#374151";
          } else if (isActive) {
            fillColor = `${NODE_COLORS[i]}20`;
            strokeColor = NODE_COLORS[i];
            textColor = NODE_COLORS[i];
          } else if (isCompleted) {
            fillColor = "#14532d";
            strokeColor = "#22c55e";
            textColor = "#22c55e";
          }

          return (
            <g key={`node-${i}`}>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_R}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 1.5}
                opacity={isReflectionDisabled ? 0.4 : 1}
              >
                {isActive && (
                  <animate
                    attributeName="stroke-opacity"
                    values="1;0.4;1"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                opacity={isReflectionDisabled ? 0.3 : 1}
                style={{
                  fontSize: "9px",
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "monospace",
                }}
              >
                {t(labelKey)}
              </text>

              {/* Checkmark for completed */}
              {isCompleted && !isActive && (
                <text
                  x={pos.x + NODE_R - 5}
                  y={pos.y - NODE_R + 11}
                  textAnchor="middle"
                  fill="#22c55e"
                  style={{ fontSize: "10px" }}
                >
                  ✓
                </text>
              )}

              {/* Error marker */}
              {isActive && isStuck && i === 5 && (
                <text
                  x={pos.x + NODE_R - 3}
                  y={pos.y - NODE_R + 11}
                  textAnchor="middle"
                  fill="#ef4444"
                  style={{ fontSize: "10px", fontWeight: 700 }}
                >
                  !
                </text>
              )}
            </g>
          );
        })}

        {/* Goal text at bottom */}
        <foreignObject x={20} y={285} width={260} height={35}>
          <div
            className="text-[10px] leading-tight text-center px-2"
            style={{ color: "#9ca3af", fontFamily: "monospace" }}
          >
            {goalText}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
