import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  MusicAssistantClient,
  MediaItem,
  BrowseFolder,
  ItemMapping,
  Track,
  Album,
  Artist,
  Playlist,
} from "../client.js";

export const browseTools: Tool[] = [
  {
    name: "browse_library",
    description:
      "Browse the music library. Can browse root, specific paths, or provider content. Use this to explore available music.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Optional path to browse. Leave empty for root. Use provider URIs to browse specific providers.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_library_items",
    description: "Get items from the music library by type (artists, albums, tracks, playlists, or radio stations).",
    inputSchema: {
      type: "object",
      properties: {
        media_type: {
          type: "string",
          enum: ["artist", "album", "track", "playlist", "radio"],
          description: "Type of library items to retrieve",
        },
        limit: {
          type: "number",
          description: "Maximum number of items to return (default: 50)",
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
        },
        search: {
          type: "string",
          description: "Optional filter by name",
        },
        favorites_only: {
          type: "boolean",
          description: "Only show favorites (default: false)",
        },
        order_by: {
          type: "string",
          description:
            "Sort order: 'name', 'sort_name', 'timestamp_added', 'timestamp_modified', 'last_played', 'play_count', 'random' (default: 'sort_name')",
        },
      },
      required: ["media_type"],
    },
  },
  {
    name: "get_item_children",
    description: "Get child items of a media item: tracks from an album/playlist, or albums/tracks from an artist.",
    inputSchema: {
      type: "object",
      properties: {
        uri: {
          type: "string",
          description: "The URI of the parent item (e.g., 'spotify://album/abc123', 'spotify://artist/xyz')",
        },
        child_type: {
          type: "string",
          enum: ["tracks", "albums"],
          description: "Type of children to get. For albums/playlists use 'tracks'. For artists use 'tracks' or 'albums'.",
        },
        limit: {
          type: "number",
          description: "Maximum number of items to return (default: 100, only for playlist tracks)",
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0, only for playlist tracks)",
        },
      },
      required: ["uri", "child_type"],
    },
  },
  {
    name: "get_recommendations",
    description:
      "Get personalized music recommendations based on listening history.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_recently_played",
    description: "Get recently played items.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of items to return (default: 25)",
        },
        media_types: {
          type: "array",
          items: { type: "string" },
          description:
            "Filter by media types (e.g., ['track', 'album']). Default: all types",
        },
      },
      required: [],
    },
  },
  {
    name: "get_item_details",
    description: "Get detailed information about a media item by its URI.",
    inputSchema: {
      type: "object",
      properties: {
        uri: {
          type: "string",
          description: "The URI of the media item (e.g., 'spotify://track/abc123')",
        },
      },
      required: ["uri"],
    },
  },
];

function parseUri(
  uri: string
): { provider: string; mediaType: string; itemId: string } | null {
  // Handle URIs like "spotify://track/abc123" or "library://album/123"
  const match = uri.match(/^([^:]+):\/\/([^/]+)\/(.+)$/);
  if (match) {
    return {
      provider: match[1],
      mediaType: match[2],
      itemId: match[3],
    };
  }
  return null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatItem(item: MediaItem | BrowseFolder | ItemMapping): string {
  if (!item) return "";

  const mediaType = item.media_type || "unknown";
  const uri =
    "uri" in item && item.uri
      ? item.uri
      : `${item.provider}://${mediaType}/${item.item_id}`;

  switch (mediaType) {
    case "track": {
      const track = item as Track;
      const artists =
        track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      const album = track.album ? ` (${track.album.name})` : "";
      const duration = track.duration
        ? ` [${formatDuration(track.duration)}]`
        : "";
      return `- **${track.name}** by ${artists}${album}${duration}\n  URI: ${uri}`;
    }
    case "album": {
      const album = item as Album;
      const artists =
        album.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      const year = album.year ? ` (${album.year})` : "";
      return `- **${album.name}** by ${artists}${year}\n  URI: ${uri}`;
    }
    case "artist": {
      const artist = item as Artist;
      return `- **${artist.name}**\n  URI: ${uri}`;
    }
    case "playlist": {
      const playlist = item as Playlist;
      const owner = playlist.owner ? ` (by ${playlist.owner})` : "";
      return `- **${playlist.name}**${owner}\n  URI: ${uri}`;
    }
    case "folder": {
      const folder = item as BrowseFolder;
      return `- 📁 **${folder.name}**\n  Path: ${folder.path || uri}`;
    }
    default:
      return `- **${item.name}**\n  URI: ${uri}`;
  }
}

export async function handleBrowseTool(
  client: MusicAssistantClient,
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: { type: string; text: string }[]; isError?: boolean }> {
  switch (name) {
    case "browse_library": {
      const path = args?.path as string | undefined;
      const results = await client.executeCommand<
        (MediaItem | BrowseFolder | ItemMapping)[]
      >("music/browse", { path });

      if (!results || results.length === 0) {
        return { content: [{ type: "text", text: "No items found." }] };
      }

      const formatted = results.map(formatItem).join("\n");
      return { content: [{ type: "text", text: formatted }] };
    }

    case "get_library_items": {
      const mediaType = args?.media_type as string;
      const limit = (args?.limit as number) || 50;
      const offset = (args?.offset as number) || 0;
      const search = args?.search as string | undefined;
      const favorite = args?.favorites_only as boolean | undefined;
      const orderBy = (args?.order_by as string) || "sort_name";

      if (!mediaType) {
        return {
          content: [{ type: "text", text: "Error: media_type is required" }],
          isError: true,
        };
      }

      // Map media type to API endpoint
      const endpointMap: Record<string, string> = {
        artist: "music/artists/library_items",
        album: "music/albums/library_items",
        track: "music/tracks/library_items",
        playlist: "music/playlists/library_items",
        radio: "music/radios/library_items",
      };

      const endpoint = endpointMap[mediaType];
      if (!endpoint) {
        return {
          content: [{ type: "text", text: `Invalid media_type: ${mediaType}` }],
          isError: true,
        };
      }

      const results = await client.executeCommand<MediaItem[]>(endpoint, {
        limit,
        offset,
        search,
        favorite,
        order_by: orderBy,
      });

      if (!results || results.length === 0) {
        return { content: [{ type: "text", text: `No ${mediaType}s found.` }] };
      }

      const formatted = results.map(formatItem).join("\n");
      const title = mediaType.charAt(0).toUpperCase() + mediaType.slice(1) + "s";
      return {
        content: [{ type: "text", text: `## Library ${title}\n${formatted}` }],
      };
    }

    case "get_item_children": {
      const uri = args?.uri as string;
      const childType = args?.child_type as string;

      if (!uri) {
        return {
          content: [{ type: "text", text: "Error: uri is required" }],
          isError: true,
        };
      }

      if (!childType) {
        return {
          content: [{ type: "text", text: "Error: child_type is required" }],
          isError: true,
        };
      }

      const parsed = parseUri(uri);
      if (!parsed) {
        return {
          content: [{ type: "text", text: "Invalid URI format" }],
          isError: true,
        };
      }

      const { provider, mediaType, itemId } = parsed;

      // Handle based on parent media type and requested child type
      if (mediaType === "album" && childType === "tracks") {
        const album = await client.executeCommand<Album>("music/albums/get", {
          item_id: itemId,
          provider_instance_id_or_domain: provider,
        });

        const results = await client.executeCommand<Track[]>(
          "music/albums/tracks",
          {
            item_id: itemId,
            provider_instance_id_or_domain: provider,
          }
        );

        if (!results || results.length === 0) {
          return { content: [{ type: "text", text: "No tracks found." }] };
        }

        const formatted = results.map(formatItem).join("\n");
        const albumTitle = album?.name || "Album";
        return {
          content: [
            { type: "text", text: `## Tracks from "${albumTitle}"\n${formatted}` },
          ],
        };
      }

      if (mediaType === "playlist" && childType === "tracks") {
        const limit = (args?.limit as number) || 100;
        const offset = (args?.offset as number) || 0;

        const playlist = await client.executeCommand<Playlist>(
          "music/playlists/get",
          {
            item_id: itemId,
            provider_instance_id_or_domain: provider,
          }
        );

        const results = await client.executeCommand<Track[]>(
          "music/playlists/tracks",
          {
            item_id: itemId,
            provider_instance_id_or_domain: provider,
            limit,
            offset,
          }
        );

        if (!results || results.length === 0) {
          return { content: [{ type: "text", text: "No tracks found." }] };
        }

        const formatted = results.map(formatItem).join("\n");
        const playlistTitle = playlist?.name || "Playlist";
        return {
          content: [
            { type: "text", text: `## Tracks from "${playlistTitle}"\n${formatted}` },
          ],
        };
      }

      if (mediaType === "artist" && childType === "albums") {
        const artist = await client.executeCommand<Artist>("music/artists/get", {
          item_id: itemId,
          provider_instance_id_or_domain: provider,
        });

        const results = await client.executeCommand<Album[]>(
          "music/artists/albums",
          {
            item_id: itemId,
            provider_instance_id_or_domain: provider,
          }
        );

        if (!results || results.length === 0) {
          return { content: [{ type: "text", text: "No albums found." }] };
        }

        const formatted = results.map(formatItem).join("\n");
        const artistName = artist?.name || "Artist";
        return {
          content: [
            { type: "text", text: `## Albums by "${artistName}"\n${formatted}` },
          ],
        };
      }

      if (mediaType === "artist" && childType === "tracks") {
        const artist = await client.executeCommand<Artist>("music/artists/get", {
          item_id: itemId,
          provider_instance_id_or_domain: provider,
        });

        const results = await client.executeCommand<Track[]>(
          "music/artists/tracks",
          {
            item_id: itemId,
            provider_instance_id_or_domain: provider,
          }
        );

        if (!results || results.length === 0) {
          return { content: [{ type: "text", text: "No tracks found." }] };
        }

        const formatted = results.map(formatItem).join("\n");
        const artistName = artist?.name || "Artist";
        return {
          content: [
            { type: "text", text: `## Top Tracks by "${artistName}"\n${formatted}` },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Cannot get ${childType} from ${mediaType}. Valid combinations: album->tracks, playlist->tracks, artist->albums, artist->tracks`,
          },
        ],
        isError: true,
      };
    }

    case "get_recommendations": {
      const results = await client.executeCommand<
        { name: string; items: MediaItem[] }[]
      >("music/recommendations");

      if (!results || results.length === 0) {
        return {
          content: [{ type: "text", text: "No recommendations available." }],
        };
      }

      const sections = results
        .map((section) => {
          const items = section.items.map(formatItem).join("\n");
          return `## ${section.name}\n${items}`;
        })
        .join("\n\n");

      return { content: [{ type: "text", text: sections }] };
    }

    case "get_recently_played": {
      const limit = (args?.limit as number) || 25;
      const mediaTypes = args?.media_types as string[] | undefined;

      const results = await client.executeCommand<MediaItem[]>(
        "music/recently_played_items",
        {
          limit,
          media_types: mediaTypes,
        }
      );

      if (!results || results.length === 0) {
        return {
          content: [{ type: "text", text: "No recently played items." }],
        };
      }

      const formatted = results.map(formatItem).join("\n");
      return {
        content: [{ type: "text", text: `## Recently Played\n${formatted}` }],
      };
    }

    case "get_item_details": {
      const uri = args?.uri as string;
      if (!uri) {
        return {
          content: [{ type: "text", text: "URI is required" }],
          isError: true,
        };
      }

      const result = await client.executeCommand<MediaItem>("music/item_by_uri", {
        uri,
      });

      if (!result) {
        return { content: [{ type: "text", text: "Item not found." }] };
      }

      // Format detailed information
      let details = `## ${result.name}\n\n`;
      details += `**Type:** ${result.media_type}\n`;
      details += `**Provider:** ${result.provider}\n`;

      if ("uri" in result && result.uri) {
        details += `**URI:** ${result.uri}\n`;
      }

      if ("artists" in result && result.artists) {
        const artistNames = result.artists.map((a) => a.name).join(", ");
        details += `**Artists:** ${artistNames}\n`;
      }

      if ("album" in result && result.album) {
        details += `**Album:** ${result.album.name}\n`;
      }

      if ("year" in result && result.year) {
        details += `**Year:** ${result.year}\n`;
      }

      if ("duration" in result && result.duration) {
        details += `**Duration:** ${formatDuration(result.duration)}\n`;
      }

      if ("favorite" in result) {
        details += `**Favorite:** ${result.favorite ? "Yes" : "No"}\n`;
      }

      if (result.metadata?.description) {
        details += `\n**Description:**\n${result.metadata.description}\n`;
      }

      if (result.metadata?.genres && result.metadata.genres.length > 0) {
        details += `**Genres:** ${result.metadata.genres.join(", ")}\n`;
      }

      return { content: [{ type: "text", text: details }] };
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown browse tool: ${name}` }],
        isError: true,
      };
  }
}
