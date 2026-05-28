"use client";

import { useMCPStore } from "@/store/mcp-store";
import { MCPBridge } from "./MCPBridge";
import { ServerList } from "./ServerList";
import { DiscoveryPanel } from "./DiscoveryPanel";
import { MCPControls } from "./MCPControls";

export function MCPScene() {

  const {
    selectedServerId,
    selectedServer,
    discoveryStep,
    showDiscovery,
    selectedTool,
    generatedArgs,
    toolResult,
    useVagueDescriptions,
    setServer,
  } = useMCPStore();

  return (
    <div className="space-y-6">
      {/* MCP Bridge diagram */}
      <MCPBridge
        server={selectedServer}
        discoveryStep={discoveryStep}
        showDiscovery={showDiscovery}
      />

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4 min-w-0">
          {/* Server list */}
          <ServerList
            selectedServerId={selectedServerId}
            discoveryStep={discoveryStep}
            onSelect={setServer}
          />

          {/* Discovery panel */}
          <DiscoveryPanel
            server={selectedServer}
            discoveryStep={discoveryStep}
            showDiscovery={showDiscovery}
            selectedTool={selectedTool}
            generatedArgs={generatedArgs}
            toolResult={toolResult}
            useVagueDescriptions={useVagueDescriptions}
          />
        </div>

        {/* Controls sidebar */}
        <div className="space-y-4">
          <MCPControls />
        </div>
      </div>
    </div>
  );
}
