#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { MusicAssistantClient } from "./client.js";
import { searchTools, handleSearchTool } from "./tools/search.js";
import { browseTools, handleBrowseTool } from "./tools/browse.js";
import { playbackTools, handlePlaybackTool } from "./tools/playback.js";
import { playerTools, handlePlayerTool } from "./tools/player.js";

const MA_URL = process.env.MA_URL || "http://localhost:8095";
const MA_TOKEN = process.env.MA_TOKEN;

if (!MA_TOKEN) {
  console.error("Error: MA_TOKEN environment variable is required");
  process.exit(1);
}

const client = new MusicAssistantClient(MA_URL, MA_TOKEN);

const allTools: Tool[] = [
  ...searchTools,
  ...browseTools,
  ...playbackTools,
  ...playerTools,
];

const server = new Server(
  {
    name: "music-assistant-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Route to appropriate handler
    if (searchTools.find((t) => t.name === name)) {
      return await handleSearchTool(client, name, args);
    }
    if (browseTools.find((t) => t.name === name)) {
      return await handleBrowseTool(client, name, args);
    }
    if (playbackTools.find((t) => t.name === name)) {
      return await handlePlaybackTool(client, name, args);
    }
    if (playerTools.find((t) => t.name === name)) {
      return await handlePlayerTool(client, name, args);
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Music Assistant MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
