export const playbackTools = [
    {
        name: "play_media",
        description: "Play media (track, album, playlist, artist, radio, etc.) on a player. Use this to start playing something.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player to play on. Use get_players to find available players.",
                },
                media_uri: {
                    type: "string",
                    description: "The URI of the media to play (e.g., 'spotify://track/abc123'). Can be a single item or multiple URIs as array.",
                },
                media_uris: {
                    type: "array",
                    items: { type: "string" },
                    description: "Multiple URIs to play (for adding multiple items at once)",
                },
                queue_option: {
                    type: "string",
                    enum: ["play", "replace", "next", "replace_next", "add"],
                    description: "How to handle the queue: 'play' (play now), 'replace' (replace queue and play), 'next' (play next), 'replace_next' (replace upcoming), 'add' (add to end). Default: 'play'",
                },
                radio_mode: {
                    type: "boolean",
                    description: "Enable radio mode (auto-add similar tracks). Default: false",
                },
            },
            required: ["player_id"],
        },
    },
    {
        name: "play",
        description: "Resume playback on a player.",
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
        name: "pause",
        description: "Pause playback on a player.",
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
        name: "play_pause",
        description: "Toggle play/pause on a player.",
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
        name: "stop",
        description: "Stop playback on a player.",
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
        name: "next_track",
        description: "Skip to the next track in the queue.",
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
        name: "previous_track",
        description: "Go back to the previous track in the queue.",
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
        name: "seek",
        description: "Seek to a specific position in the current track.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                position: {
                    type: "number",
                    description: "Position in seconds",
                },
            },
            required: ["player_id", "position"],
        },
    },
    {
        name: "set_volume",
        description: "Set the volume level of a player.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                volume_level: {
                    type: "number",
                    description: "Volume level (0-100)",
                },
            },
            required: ["player_id", "volume_level"],
        },
    },
    {
        name: "volume_up",
        description: "Increase the volume of a player.",
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
        name: "volume_down",
        description: "Decrease the volume of a player.",
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
        name: "mute",
        description: "Mute or unmute a player.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                muted: {
                    type: "boolean",
                    description: "True to mute, false to unmute",
                },
            },
            required: ["player_id", "muted"],
        },
    },
    {
        name: "set_shuffle",
        description: "Enable or disable shuffle mode.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                shuffle: {
                    type: "boolean",
                    description: "True to enable shuffle, false to disable",
                },
            },
            required: ["player_id", "shuffle"],
        },
    },
    {
        name: "set_repeat",
        description: "Set the repeat mode.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                repeat_mode: {
                    type: "string",
                    enum: ["off", "one", "all"],
                    description: "Repeat mode: 'off', 'one' (repeat current track), 'all' (repeat queue)",
                },
            },
            required: ["player_id", "repeat_mode"],
        },
    },
    {
        name: "clear_queue",
        description: "Clear the play queue.",
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
        name: "get_queue",
        description: "Get the current play queue for a player.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                limit: {
                    type: "number",
                    description: "Maximum number of queue items to return (default: 25)",
                },
                offset: {
                    type: "number",
                    description: "Offset for pagination (default: 0)",
                },
            },
            required: ["player_id"],
        },
    },
    {
        name: "play_queue_index",
        description: "Play a specific item in the queue by its index.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                index: {
                    type: "number",
                    description: "Index of the item in the queue (0-based)",
                },
            },
            required: ["player_id", "index"],
        },
    },
    {
        name: "remove_queue_item",
        description: "Remove an item from the queue.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                item_id_or_index: {
                    type: "string",
                    description: "Queue item ID or index to remove",
                },
            },
            required: ["player_id", "item_id_or_index"],
        },
    },
    {
        name: "move_queue_item",
        description: "Move an item in the queue to a different position.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                queue_item_id: {
                    type: "string",
                    description: "The queue item ID to move",
                },
                position_shift: {
                    type: "number",
                    description: "Number of positions to shift (negative = earlier, positive = later)",
                },
            },
            required: ["player_id", "queue_item_id", "position_shift"],
        },
    },
    {
        name: "transfer_queue",
        description: "Transfer the play queue from one player to another.",
        inputSchema: {
            type: "object",
            properties: {
                source_player_id: {
                    type: "string",
                    description: "The ID of the source player",
                },
                target_player_id: {
                    type: "string",
                    description: "The ID of the target player",
                },
            },
            required: ["source_player_id", "target_player_id"],
        },
    },
    {
        name: "power",
        description: "Power on or off a player.",
        inputSchema: {
            type: "object",
            properties: {
                player_id: {
                    type: "string",
                    description: "The ID of the player",
                },
                powered: {
                    type: "boolean",
                    description: "True to power on, false to power off",
                },
            },
            required: ["player_id", "powered"],
        },
    },
];
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
function formatQueueItem(item, index) {
    const duration = item.duration ? ` [${formatDuration(item.duration)}]` : "";
    return `${index + 1}. **${item.name}**${duration} (ID: ${item.queue_item_id})`;
}
export async function handlePlaybackTool(client, name, args) {
    const playerId = args?.player_id;
    if (!playerId &&
        name !== "transfer_queue") {
        return {
            content: [{ type: "text", text: "Error: player_id is required" }],
            isError: true,
        };
    }
    switch (name) {
        case "play_media": {
            const mediaUri = args?.media_uri;
            const mediaUris = args?.media_uris;
            const queueOption = args?.queue_option || "play";
            const radioMode = args?.radio_mode || false;
            const media = mediaUris || (mediaUri ? mediaUri : undefined);
            if (!media) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: Either media_uri or media_uris is required",
                        },
                    ],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/play_media", {
                queue_id: playerId,
                media,
                option: queueOption,
                radio_mode: radioMode,
            });
            const mediaDescription = Array.isArray(media)
                ? `${media.length} items`
                : media;
            return {
                content: [
                    {
                        type: "text",
                        text: `Started playing ${mediaDescription} on player ${playerId} (mode: ${queueOption})`,
                    },
                ],
            };
        }
        case "play": {
            await client.executeCommand("player_queues/play", { queue_id: playerId });
            return {
                content: [{ type: "text", text: `Resumed playback on ${playerId}` }],
            };
        }
        case "pause": {
            await client.executeCommand("player_queues/pause", {
                queue_id: playerId,
            });
            return {
                content: [{ type: "text", text: `Paused playback on ${playerId}` }],
            };
        }
        case "play_pause": {
            await client.executeCommand("player_queues/play_pause", {
                queue_id: playerId,
            });
            return {
                content: [
                    { type: "text", text: `Toggled play/pause on ${playerId}` },
                ],
            };
        }
        case "stop": {
            await client.executeCommand("player_queues/stop", { queue_id: playerId });
            return {
                content: [{ type: "text", text: `Stopped playback on ${playerId}` }],
            };
        }
        case "next_track": {
            await client.executeCommand("player_queues/next", { queue_id: playerId });
            return {
                content: [{ type: "text", text: `Skipped to next track on ${playerId}` }],
            };
        }
        case "previous_track": {
            await client.executeCommand("player_queues/previous", {
                queue_id: playerId,
            });
            return {
                content: [
                    { type: "text", text: `Went to previous track on ${playerId}` },
                ],
            };
        }
        case "seek": {
            const position = args?.position;
            if (position === undefined) {
                return {
                    content: [{ type: "text", text: "Error: position is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/seek", {
                queue_id: playerId,
                position,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Seeked to ${formatDuration(position)} on ${playerId}`,
                    },
                ],
            };
        }
        case "set_volume": {
            const volumeLevel = args?.volume_level;
            if (volumeLevel === undefined) {
                return {
                    content: [{ type: "text", text: "Error: volume_level is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("players/cmd/volume_set", {
                player_id: playerId,
                volume_level: Math.max(0, Math.min(100, volumeLevel)),
            });
            return {
                content: [
                    { type: "text", text: `Set volume to ${volumeLevel}% on ${playerId}` },
                ],
            };
        }
        case "volume_up": {
            await client.executeCommand("players/cmd/volume_up", {
                player_id: playerId,
            });
            return {
                content: [{ type: "text", text: `Increased volume on ${playerId}` }],
            };
        }
        case "volume_down": {
            await client.executeCommand("players/cmd/volume_down", {
                player_id: playerId,
            });
            return {
                content: [{ type: "text", text: `Decreased volume on ${playerId}` }],
            };
        }
        case "mute": {
            const muted = args?.muted;
            if (muted === undefined) {
                return {
                    content: [{ type: "text", text: "Error: muted is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("players/cmd/volume_mute", {
                player_id: playerId,
                muted,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `${muted ? "Muted" : "Unmuted"} ${playerId}`,
                    },
                ],
            };
        }
        case "set_shuffle": {
            const shuffle = args?.shuffle;
            if (shuffle === undefined) {
                return {
                    content: [{ type: "text", text: "Error: shuffle is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/shuffle", {
                queue_id: playerId,
                shuffle_enabled: shuffle,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `${shuffle ? "Enabled" : "Disabled"} shuffle on ${playerId}`,
                    },
                ],
            };
        }
        case "set_repeat": {
            const repeatMode = args?.repeat_mode;
            if (!repeatMode) {
                return {
                    content: [{ type: "text", text: "Error: repeat_mode is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/repeat", {
                queue_id: playerId,
                repeat_mode: repeatMode,
            });
            return {
                content: [
                    { type: "text", text: `Set repeat mode to '${repeatMode}' on ${playerId}` },
                ],
            };
        }
        case "clear_queue": {
            await client.executeCommand("player_queues/clear", {
                queue_id: playerId,
            });
            return {
                content: [{ type: "text", text: `Cleared queue on ${playerId}` }],
            };
        }
        case "get_queue": {
            const limit = args?.limit || 25;
            const offset = args?.offset || 0;
            const queue = await client.executeCommand("player_queues/get", { queue_id: playerId });
            const items = await client.executeCommand("player_queues/items", {
                queue_id: playerId,
                limit,
                offset,
            });
            let output = `## Queue: ${queue.display_name}\n\n`;
            output += `**State:** ${queue.state || "unknown"}\n`;
            output += `**Total Items:** ${queue.items}\n`;
            output += `**Shuffle:** ${queue.shuffle_enabled ? "On" : "Off"}\n`;
            output += `**Repeat:** ${queue.repeat_mode || "off"}\n\n`;
            if (queue.current_item) {
                output += `**Now Playing:** ${queue.current_item.name}\n`;
                if (queue.elapsed_time !== undefined && queue.current_item.duration) {
                    output += `**Position:** ${formatDuration(queue.elapsed_time)} / ${formatDuration(queue.current_item.duration)}\n`;
                }
                output += "\n";
            }
            if (items && items.length > 0) {
                output += "### Queue Items:\n";
                output += items.map((item, idx) => formatQueueItem(item, offset + idx)).join("\n");
            }
            else {
                output += "Queue is empty.";
            }
            return { content: [{ type: "text", text: output }] };
        }
        case "play_queue_index": {
            const index = args?.index;
            if (index === undefined) {
                return {
                    content: [{ type: "text", text: "Error: index is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/play_index", {
                queue_id: playerId,
                index,
            });
            return {
                content: [
                    { type: "text", text: `Playing queue item at index ${index} on ${playerId}` },
                ],
            };
        }
        case "remove_queue_item": {
            const itemIdOrIndex = args?.item_id_or_index;
            if (!itemIdOrIndex) {
                return {
                    content: [
                        { type: "text", text: "Error: item_id_or_index is required" },
                    ],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/delete_item", {
                queue_id: playerId,
                item_id_or_index: itemIdOrIndex,
            });
            return {
                content: [
                    { type: "text", text: `Removed item ${itemIdOrIndex} from queue on ${playerId}` },
                ],
            };
        }
        case "move_queue_item": {
            const queueItemId = args?.queue_item_id;
            const positionShift = args?.position_shift;
            if (!queueItemId || positionShift === undefined) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: queue_item_id and position_shift are required",
                        },
                    ],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/move_item", {
                queue_id: playerId,
                queue_item_id: queueItemId,
                pos_shift: positionShift,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Moved queue item ${queueItemId} by ${positionShift} positions`,
                    },
                ],
            };
        }
        case "transfer_queue": {
            const sourcePlayerId = args?.source_player_id;
            const targetPlayerId = args?.target_player_id;
            if (!sourcePlayerId || !targetPlayerId) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: source_player_id and target_player_id are required",
                        },
                    ],
                    isError: true,
                };
            }
            await client.executeCommand("player_queues/transfer", {
                source_queue_id: sourcePlayerId,
                target_queue_id: targetPlayerId,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Transferred queue from ${sourcePlayerId} to ${targetPlayerId}`,
                    },
                ],
            };
        }
        case "power": {
            const powered = args?.powered;
            if (powered === undefined) {
                return {
                    content: [{ type: "text", text: "Error: powered is required" }],
                    isError: true,
                };
            }
            await client.executeCommand("players/cmd/power", {
                player_id: playerId,
                powered,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `${powered ? "Powered on" : "Powered off"} ${playerId}`,
                    },
                ],
            };
        }
        default:
            return {
                content: [{ type: "text", text: `Unknown playback tool: ${name}` }],
                isError: true,
            };
    }
}
//# sourceMappingURL=playback.js.map