"use client";

import { useTranslations } from "next-intl";
import type { MCPServer } from "@/lib/simulation/mcp";

type MCPBridgeProps = {
  server: MCPServer;
  discoveryStep: string;
  showDiscovery: boolean;
};

export function MCPBridge({ server, discoveryStep, showDiscovery }: MCPBridgeProps) {
  const t = useTranslations("MCP.bridge");

  const isActive = showDiscovery && discoveryStep !== "idle";
  const isExecuting = discoveryStep === "executed";

  return (
    <div className="rounded-lg border border-border bg-surface-elevated px-2 py-4">
      <svg
        viewBox="0 0 780 170"
        className="h-auto w-full"
        aria-label={t("diagramLabel")}
        role="img"
      >
        <defs>
          <linearGradient id="mcp-arrow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.1" />
          </linearGradient>

          {/* Pulsing glow filter */}
          <filter id="mcp-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* AI Client box */}
        <rect
          x="20"
          y="45"
          width="180"
          height="80"
          rx="10"
          fill="var(--color-surface)"
          stroke={isActive ? "var(--color-accent)" : "var(--color-border)"}
          strokeWidth="1.5"
          className="transition-colors duration-500"
        />
        <text
          x="110"
          y="78"
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="13"
          fontFamily="var(--font-mono), monospace"
          fontWeight="600"
        >
          🤖 {t("aiClient")}
        </text>
        <text
          x="110"
          y="98"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize="10"
          fontFamily="var(--font-sans), sans-serif"
        >
          {t("aiClientHint")}
        </text>
        {isActive && (
          <rect
            x="20"
            y="45"
            width="180"
            height="80"
            rx="10"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            filter="url(#mcp-glow)"
            strokeDasharray="6 4"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        )}

        {/* Arrow AI → MCP */}
        <g>
          <line
            x1="205"
            y1="85"
            x2="340"
            y2="85"
            stroke={isActive ? "var(--color-accent)" : "var(--color-border)"}
            strokeWidth="1.5"
            strokeDasharray={isActive ? "6 4" : "4 6"}
            className="transition-colors duration-500"
          />
          {isActive && (
            <line
              x1="205"
              y1="85"
              x2="340"
              y2="85"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            >
              <animateTransform
                attributeName="stroke-dashoffset"
                from="0"
                to="-20"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </line>
          )}
          <polygon
            points="340,80 350,85 340,90"
            fill={isActive ? "var(--color-accent)" : "var(--color-border)"}
            className="transition-colors duration-500"
          />
          {/* Data packet */}
          {isActive && (
            <>
              <circle r="4" fill="var(--color-accent)" filter="url(#mcp-glow)">
                <animateMotion
                  path="M205,85 L340,85"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="272"
                y="78"
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="9"
                fontFamily="var(--font-mono), monospace"
                opacity="0.8"
              >
                list_tools
              </text>
            </>
          )}
        </g>

        {/* MCP Server box */}
        <rect
          x="355"
          y="45"
          width="180"
          height="80"
          rx="10"
          fill="var(--color-surface)"
          stroke={isActive ? server.color : "var(--color-border)"}
          strokeWidth={isActive ? "2" : "1.5"}
          className="transition-all duration-500"
        />
        <text
          x="445"
          y="78"
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="22"
        >
          {server.icon}
        </text>
        <text
          x="445"
          y="100"
          textAnchor="middle"
          fill={isActive ? "var(--color-primary)" : "var(--color-secondary)"}
          fontSize="13"
          fontFamily="var(--font-mono), monospace"
          fontWeight="600"
          className="transition-colors duration-500"
        >
          {server.name}
        </text>
        <text
          x="445"
          y="116"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize="10"
          fontFamily="var(--font-sans), sans-serif"
        >
          {server.tools.length} {t("tools")}
        </text>
        {/* Pulsing ring */}
        {isActive && (
          <rect
            x="355"
            y="45"
            width="180"
            height="80"
            rx="10"
            fill="none"
            stroke={server.color}
            strokeWidth="1.5"
            filter="url(#mcp-glow)"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.2;1;0.2"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="rx"
              values="10;12;10"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
        )}
        {isExecuting && (
          <rect
            x="355"
            y="45"
            width="180"
            height="80"
            rx="10"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.5;1;0.5"
              dur="1s"
              repeatCount="indefinite"
            />
          </rect>
        )}

        {/* Arrow MCP → External */}
        <g>
          <line
            x1="540"
            y1="85"
            x2="675"
            y2="85"
            stroke={isExecuting ? "var(--color-success)" : isActive ? "var(--color-accent)" : "var(--color-border)"}
            strokeWidth="1.5"
            strokeDasharray={isExecuting ? "6 4" : "4 6"}
            className="transition-colors duration-500"
          />
          {isActive && (
            <line
              x1="540"
              y1="85"
              x2="675"
              y2="85"
              stroke={isExecuting ? "var(--color-success)" : "var(--color-accent)"}
              strokeWidth="1.5"
              strokeDasharray="6 4"
            >
              <animateTransform
                attributeName="stroke-dashoffset"
                from="0"
                to="-20"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </line>
          )}
          <polygon
            points="675,80 685,85 675,90"
            fill={isExecuting ? "var(--color-success)" : isActive ? "var(--color-accent)" : "var(--color-border)"}
            className="transition-colors duration-500"
          />
          {/* Data packet (result) */}
          {isExecuting && (
            <circle r="4" fill="var(--color-success)" filter="url(#mcp-glow)">
              <animateMotion
                path="M540,85 L675,85"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          )}
          {isActive && !isExecuting && (
            <text
              x="608"
              y="78"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              opacity="0.8"
            >
              {t("requesting")}
            </text>
          )}
          {isExecuting && (
            <text
              x="608"
              y="78"
              textAnchor="middle"
              fill="var(--color-success)"
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              opacity="0.8"
            >
              {t("returning")}
            </text>
          )}
        </g>

        {/* External System box */}
        <rect
          x="690"
          y="45"
          width="70"
          height="80"
          rx="10"
          fill="var(--color-surface)"
          stroke={isExecuting ? "var(--color-success)" : "var(--color-border)"}
          strokeWidth="1.5"
          className="transition-colors duration-500"
        />
        <text
          x="725"
          y="78"
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="20"
        >
          🌐
        </text>
        <text
          x="725"
          y="100"
          fill="var(--color-muted)"
          fontSize="9"
          fontFamily="var(--font-sans), sans-serif"
          textAnchor="middle"
        >
          {t("externalSystem")}
        </text>

        {/* Labels */}
        <text
          x="110"
          y="145"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize="10"
          fontFamily="var(--font-mono), monospace"
        >
          {t("protocolLabel")}
        </text>
        <text
          x="445"
          y="145"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize="10"
          fontFamily="var(--font-mono), monospace"
        >
          {t("standardBridge")}
        </text>
        <text
          x="725"
          y="145"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize="10"
          fontFamily="var(--font-mono), monospace"
        >
          {t("dataSource")}
        </text>
      </svg>
    </div>
  );
}
