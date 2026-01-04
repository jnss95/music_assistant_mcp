// Media types for search filtering
const SEARCHABLE_MEDIA_TYPES = [
    "artist",
    "album",
    "track",
    "playlist",
    "radio",
    "audiobook",
    "podcast",
];
export const searchTools = [
    {
        name: "search",
        description: "Search for music in the library. Can search across all media types or filter by a specific type (track, album, artist, playlist, radio, podcast, audiobook).",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query string",
                },
                media_type: {
                    type: "string",
                    enum: ["track", "album", "artist", "playlist", "radio", "podcast", "audiobook"],
                    description: "Optional: Filter results to a specific media type. If not provided, searches all types.",
                },
                limit: {
                    type: "number",
                    description: "Maximum number of results (default: 25, or 10 per type when searching all types)",
                },
                library_only: {
                    type: "boolean",
                    description: "Only search items in the library (default: false, searches all providers)",
                },
            },
            required: ["query"],
        },
    },
];
function formatSearchResults(results) {
    const sections = [];
    if (results.tracks && results.tracks.length > 0) {
        sections.push("## Tracks\n" +
            results.tracks
                .map((t) => {
                const artists = "artists" in t
                    ? t.artists?.map((a) => a.name).join(", ") || "Unknown Artist"
                    : "";
                const album = "album" in t && t.album ? ` (${t.album.name})` : "";
                const duration = "duration" in t && t.duration
                    ? ` [${formatDuration(t.duration)}]`
                    : "";
                return `- **${t.name}** by ${artists}${album}${duration}\n  URI: ${t.uri || `${t.provider}://${t.media_type || "track"}/${t.item_id}`}`;
            })
                .join("\n"));
    }
    if (results.albums && results.albums.length > 0) {
        sections.push("## Albums\n" +
            results.albums
                .map((a) => {
                const artists = "artists" in a
                    ? a.artists?.map((ar) => ar.name).join(", ") || "Unknown Artist"
                    : "";
                const year = "year" in a && a.year ? ` (${a.year})` : "";
                return `- **${a.name}** by ${artists}${year}\n  URI: ${a.uri || `${a.provider}://${a.media_type || "album"}/${a.item_id}`}`;
            })
                .join("\n"));
    }
    if (results.artists && results.artists.length > 0) {
        sections.push("## Artists\n" +
            results.artists
                .map((a) => `- **${a.name}**\n  URI: ${a.uri || `${a.provider}://${a.media_type || "artist"}/${a.item_id}`}`)
                .join("\n"));
    }
    if (results.playlists && results.playlists.length > 0) {
        sections.push("## Playlists\n" +
            results.playlists
                .map((p) => {
                const owner = "owner" in p && p.owner ? ` (by ${p.owner})` : "";
                return `- **${p.name}**${owner}\n  URI: ${p.uri || `${p.provider}://${p.media_type || "playlist"}/${p.item_id}`}`;
            })
                .join("\n"));
    }
    if (results.radio && results.radio.length > 0) {
        sections.push("## Radio Stations\n" +
            results.radio
                .map((r) => `- **${r.name}**\n  URI: ${r.uri || `${r.provider}://${r.media_type || "radio"}/${r.item_id}`}`)
                .join("\n"));
    }
    if (results.podcasts && results.podcasts.length > 0) {
        sections.push("## Podcasts\n" +
            results.podcasts
                .map((p) => {
                const publisher = "publisher" in p && p.publisher ? ` (${p.publisher})` : "";
                return `- **${p.name}**${publisher}\n  URI: ${p.uri || `${p.provider}://${p.media_type || "podcast"}/${p.item_id}`}`;
            })
                .join("\n"));
    }
    if (results.audiobooks && results.audiobooks.length > 0) {
        sections.push("## Audiobooks\n" +
            results.audiobooks
                .map((a) => {
                const authors = "authors" in a && a.authors
                    ? ` by ${a.authors.join(", ")}`
                    : "";
                return `- **${a.name}**${authors}\n  URI: ${a.uri || `${a.provider}://${a.media_type || "audiobook"}/${a.item_id}`}`;
            })
                .join("\n"));
    }
    if (sections.length === 0) {
        return "No results found.";
    }
    return sections.join("\n\n");
}
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
export async function handleSearchTool(client, name, args) {
    const query = args?.query;
    const mediaType = args?.media_type;
    const libraryOnly = args?.library_only || false;
    if (!query) {
        return {
            content: [{ type: "text", text: "Error: query is required" }],
            isError: true,
        };
    }
    // Determine media types and limit based on whether filtering by type
    const mediaTypes = mediaType ? [mediaType] : SEARCHABLE_MEDIA_TYPES;
    const limit = args?.limit || (mediaType ? 25 : 10);
    const results = await client.executeCommand("music/search", {
        search_query: query,
        media_types: mediaTypes,
        limit,
        library_only: libraryOnly,
    });
    const formattedResults = formatSearchResults(results);
    return {
        content: [{ type: "text", text: formattedResults }],
    };
}
//# sourceMappingURL=search.js.map