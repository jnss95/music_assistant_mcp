# Music Assistant MCP Server

An MCP (Model Context Protocol) server for controlling Music Assistant. Search and browse your music library, and control playback on any connected player.

## Features

### Search
- **search** - Search for music with optional media type filter (`track`, `album`, `artist`, `playlist`, `radio`, `podcast`, `audiobook`)

### Library Browsing
- **browse_library** - Browse the music library structure
- **get_library_items** - Get library items by type (`artist`, `album`, `track`, `playlist`, `radio`)
- **get_item_children** - Get child items (tracks from album/playlist, albums/tracks from artist)
- **get_recommendations** - Get personalized recommendations
- **get_recently_played** - Get recently played items
- **get_item_details** - Get detailed info about a media item

### Playback Control
- **play_media** - Play any media (track, album, playlist, etc.)
- **play** / **pause** / **play_pause** / **stop** - Basic playback control
- **next_track** / **previous_track** - Track navigation
- **seek** - Seek to a position
- **set_volume** / **volume_up** / **volume_down** - Volume control
- **mute** - Mute/unmute
- **set_shuffle** - Enable/disable shuffle
- **set_repeat** - Set repeat mode (off, one, all)
- **get_queue** - View the current play queue
- **clear_queue** - Clear the queue
- **play_queue_index** - Play specific queue item
- **remove_queue_item** / **move_queue_item** - Queue management
- **transfer_queue** - Transfer playback to another player
- **power** - Power on/off player

### Player Management
- **get_players** - List all available players
- **get_player** - Get details about a specific player
- **get_player_by_name** - Find a player by name
- **get_all_queues** - List all player queues
- **group_players** - Add a player to a group
- **ungroup_player** - Remove a player from a group
- **create_player_group** - Create a new player group
- **get_now_playing** - Get current playback info

## Installation

```bash
npm install
npm run build
```

## Configuration

Set the following environment variables:

- `MA_URL` - Music Assistant server URL (default: `http://localhost:8095`)
- `MA_TOKEN` - Authentication token (required)

### Getting an Authentication Token

1. Open Music Assistant web interface
2. Go to Settings → Security
3. Create a new long-lived access token
4. Copy the token value

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "music-assistant": {
      "command": "node",
      "args": ["/path/to/music-assistant-mcp/dist/index.js"],
      "env": {
        "MA_URL": "http://your-music-assistant-server:8095",
        "MA_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Usage Examples

### Search for a song
"Search for 'Bohemian Rhapsody'"

### Play an album
"Play the album 'Dark Side of the Moon' on the living room speaker"

### Control playback
"Pause the music"
"Skip to the next track"
"Set volume to 50%"

### Browse library
"Show me my favorite albums"
"What playlists do I have?"

## Development

```bash
# Watch mode
npm run watch

# Run directly with tsx
npm run dev

# Type checking
npm run typecheck
```

## License

MIT
