import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MusicAssistantClient, Player, PlayerQueue } from "../client.js";

export const playerTools: Tool[] = [
  {
    name: "get_players",
    description:
      "Get all available music players. Use this to find player IDs for playback control.",
    inputSchema: {
      type: "object",
      properties: {
        include_unavailable: {
          type: "boolean",
          description: "Include unavailable players (default: false)",
        },
        include_disabled: {
          type: "boolean",
          description: "Include disabled players (default: false)",
        },
      },
      required: [],
    },
  },
  {
    name: "get_player",
    description: "Get detailed information about a specific player.",
    inputSchema: {
      type: "object",
      properties: {
        player_id: {
          type: "string",
          description: "The ID of the player",
        },
      },
      required: ["player_id"],
    },
  },
  {
    name: "get_player_by_name",
    description: "Find a player by its name.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the player (case-insensitive search)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_all_queues",
    description: "Get all player queues.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "group_players",
    description: "Add a player to a group (sync playback).",
    inputSchema: {
      type: "object",
      properties: {
        player_id: {
          type: "string",
          description: "The ID of the player to add to the group",
        },
        target_player: {
          type: "string",
          description: "The ID of the target player (group leader)",
        },
      },
      required: ["player_id", "target_player"],
    },
  },
  {
    name: "ungroup_player",
    description: "Remove a player from its group.",
    inputSchema: {
      type: "object",
      properties: {
        player_id: {
          type: "string",
          description: "The ID of the player to ungroup",
        },
      },
      required: ["player_id"],
    },
  },
  {
    name: "create_player_group",
    description: "Create a new player group with multiple players.",
    inputSchema: {
      type: "object",
      properties: {
        target_player: {
          type: "string",
          description: "The ID of the target player (will be the group leader)",
        },
        member_player_ids: {
          type: "array",
          items: { type: "string" },
          description: "List of player IDs to add to the group",
        },
      },
      required: ["target_player", "member_player_ids"],
    },
  },
  {
    name: "get_now_playing",
    description: "Get information about what is currently playing on a player.",
    inputSchema: {
      type: "object",
      properties: {
        player_id: {
          type: "string",
          description: "The ID of the player",
        },
      },
      required: ["player_id"],
    },
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatPlayer(player: Player): string {
  const status = player.available ? "✓" : "✗";
  const state = player.playback_state || "unknown";
  const volume =
    player.volume_level !== null ? `${player.volume_level}%` : "N/A";
  const powered =
    player.powered !== null ? (player.powered ? "On" : "Off") : "N/A";

  let output = `${status} **${player.name}** (ID: \`${player.player_id}\`)\n`;
  output += `   Type: ${player.type} | Provider: ${player.provider}\n`;
  output += `   State: ${state} | Volume: ${volume} | Power: ${powered}\n`;

  if (player.current_media) {
    const media = player.current_media;
    output += `   Now Playing: ${media.title || "Unknown"}`;
    if (media.artist) output += ` by ${media.artist}`;
    if (media.album) output += ` (${media.album})`;
    output += "\n";
  }

  if (player.group_members && player.group_members.length > 0) {
    output += `   Group Members: ${player.group_members.join(", ")}\n`;
  }

  if (player.synced_to) {
    output += `   Synced to: ${player.synced_to}\n`;
  }

  return output;
}

function formatQueue(queue: PlayerQueue): string {
  let output = `**${queue.display_name}** (ID: \`${queue.queue_id}\`)\n`;
  output += `   State: ${queue.state || "unknown"} | Items: ${queue.items}\n`;
  output += `   Shuffle: ${queue.shuffle_enabled ? "On" : "Off"} | Repeat: ${queue.repeat_mode || "off"}\n`;

  if (queue.current_item) {
    output += `   Current: ${queue.current_item.name}`;
    if (queue.elapsed_time !== undefined && queue.current_item.duration) {
      output += ` (${formatDuration(queue.elapsed_time)} / ${formatDuration(queue.current_item.duration)})`;
    }
    output += "\n";
  }

  if (queue.next_item) {
    output += `   Next: ${queue.next_item.name}\n`;
  }

  return output;
}

export async function handlePlayerTool(
  client: MusicAssistantClient,
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: { type: string; text: string }[]; isError?: boolean }> {
  switch (name) {
    case "get_players": {
      const includeUnavailable = (args?.include_unavailable as boolean) || false;
      const includeDisabled = (args?.include_disabled as boolean) || false;

      const players = await client.executeCommand<Player[]>("players/all", {
        return_unavailable: includeUnavailable,
        return_disabled: includeDisabled,
      });

      if (!players || players.length === 0) {
        return { content: [{ type: "text", text: "No players found." }] };
      }

      const formatted = players.map(formatPlayer).join("\n");
      return {
        content: [
          { type: "text", text: `## Available Players\n\n${formatted}` },
        ],
      };
    }

    case "get_player": {
      const playerId = args?.player_id as string;
      if (!playerId) {
        return {
          content: [{ type: "text", text: "Error: player_id is required" }],
          isError: true,
        };
      }

      const player = await client.executeCommand<Player>("players/get", {
        player_id: playerId,
      });

      if (!player) {
        return { content: [{ type: "text", text: "Player not found." }] };
      }

      let output = `## Player: ${player.name}\n\n`;
      output += `**ID:** \`${player.player_id}\`\n`;
      output += `**Type:** ${player.type}\n`;
      output += `**Provider:** ${player.provider}\n`;
      output += `**Available:** ${player.available ? "Yes" : "No"}\n`;
      output += `**Playback State:** ${player.playback_state || "unknown"}\n`;

      if (player.volume_level !== null) {
        output += `**Volume:** ${player.volume_level}%`;
        if (player.volume_muted) output += " (Muted)";
        output += "\n";
      }

      if (player.powered !== null) {
        output += `**Power:** ${player.powered ? "On" : "Off"}\n`;
      }

      if (player.elapsed_time !== undefined && player.elapsed_time !== null) {
        output += `**Elapsed Time:** ${formatDuration(player.elapsed_time)}\n`;
      }

      if (player.current_media) {
        const media = player.current_media;
        output += `\n### Now Playing\n`;
        output += `**Title:** ${media.title || "Unknown"}\n`;
        if (media.artist) output += `**Artist:** ${media.artist}\n`;
        if (media.album) output += `**Album:** ${media.album}\n`;
        if (media.duration) output += `**Duration:** ${formatDuration(media.duration)}\n`;
        if (media.image_url) output += `**Image:** ${media.image_url}\n`;
      }

      if (player.group_members && player.group_members.length > 0) {
        output += `\n**Group Members:** ${player.group_members.join(", ")}\n`;
      }

      if (player.synced_to) {
        output += `**Synced To:** ${player.synced_to}\n`;
      }

      if (player.source_list && player.source_list.length > 0) {
        output += `\n### Available Sources\n`;
        player.source_list.forEach((source) => {
          const active = source.id === player.active_source ? " ← Active" : "";
          output += `- ${source.name} (ID: ${source.id})${active}\n`;
        });
      }

      return { content: [{ type: "text", text: output }] };
    }

    case "get_player_by_name": {
      const playerName = args?.name as string;
      if (!playerName) {
        return {
          content: [{ type: "text", text: "Error: name is required" }],
          isError: true,
        };
      }

      const player = await client.executeCommand<Player>("players/get_by_name", {
        name: playerName,
      });

      if (!player) {
        return {
          content: [
            { type: "text", text: `No player found with name "${playerName}"` },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `## Found Player\n\n${formatPlayer(player)}`,
          },
        ],
      };
    }

    case "get_all_queues": {
      const queues = await client.executeCommand<PlayerQueue[]>(
        "player_queues/all"
      );

      if (!queues || queues.length === 0) {
        return { content: [{ type: "text", text: "No queues found." }] };
      }

      const formatted = queues.map(formatQueue).join("\n");
      return {
        content: [{ type: "text", text: `## Player Queues\n\n${formatted}` }],
      };
    }

    case "group_players": {
      const playerId = args?.player_id as string;
      const targetPlayer = args?.target_player as string;

      if (!playerId || !targetPlayer) {
        return {
          content: [
            {
              type: "text",
              text: "Error: player_id and target_player are required",
            },
          ],
          isError: true,
        };
      }

      await client.executeCommand("players/cmd/group", {
        player_id: playerId,
        target_player: targetPlayer,
      });

      return {
        content: [
          {
            type: "text",
            text: `Added ${playerId} to group with ${targetPlayer}`,
          },
        ],
      };
    }

    case "ungroup_player": {
      const playerId = args?.player_id as string;
      if (!playerId) {
        return {
          content: [{ type: "text", text: "Error: player_id is required" }],
          isError: true,
        };
      }

      await client.executeCommand("players/cmd/ungroup", {
        player_id: playerId,
      });

      return {
        content: [{ type: "text", text: `Ungrouped ${playerId}` }],
      };
    }

    case "create_player_group": {
      const targetPlayer = args?.target_player as string;
      const memberPlayerIds = args?.member_player_ids as string[];

      if (!targetPlayer || !memberPlayerIds || memberPlayerIds.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "Error: target_player and member_player_ids are required",
            },
          ],
          isError: true,
        };
      }

      await client.executeCommand("players/cmd/group_many", {
        target_player: targetPlayer,
        child_player_ids: memberPlayerIds,
      });

      return {
        content: [
          {
            type: "text",
            text: `Created group with ${targetPlayer} as leader and members: ${memberPlayerIds.join(", ")}`,
          },
        ],
      };
    }

    case "get_now_playing": {
      const playerId = args?.player_id as string;
      if (!playerId) {
        return {
          content: [{ type: "text", text: "Error: player_id is required" }],
          isError: true,
        };
      }

      const player = await client.executeCommand<Player>("players/get", {
        player_id: playerId,
      });

      if (!player) {
        return { content: [{ type: "text", text: "Player not found." }] };
      }

      if (!player.current_media) {
        return {
          content: [
            { type: "text", text: `Nothing is currently playing on ${player.name}` },
          ],
        };
      }

      const media = player.current_media;
      let output = `## Now Playing on ${player.name}\n\n`;
      output += `**Title:** ${media.title || "Unknown"}\n`;
      if (media.artist) output += `**Artist:** ${media.artist}\n`;
      if (media.album) output += `**Album:** ${media.album}\n`;
      output += `**State:** ${player.playback_state || "unknown"}\n`;

      if (player.elapsed_time !== undefined && player.elapsed_time !== null && media.duration) {
        output += `**Progress:** ${formatDuration(player.elapsed_time)} / ${formatDuration(media.duration)}\n`;
      } else if (media.duration) {
        output += `**Duration:** ${formatDuration(media.duration)}\n`;
      }

      if (player.volume_level !== null) {
        output += `**Volume:** ${player.volume_level}%`;
        if (player.volume_muted) output += " (Muted)";
        output += "\n";
      }

      if (media.image_url) {
        output += `**Image:** ${media.image_url}\n`;
      }

      return { content: [{ type: "text", text: output }] };
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown player tool: ${name}` }],
        isError: true,
      };
  }
}
