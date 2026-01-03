/**
 * Music Assistant API Client
 */
export class MusicAssistantClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
  }

  /**
   * Execute a Music Assistant API command
   */
  async executeCommand<T = unknown>(
    command: string,
    args: Record<string, unknown> = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ command, args }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error (${response.status}): ${errorText || response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }
}

// Type definitions for Music Assistant API responses

export interface MediaItemImage {
  type: string;
  path: string;
  provider: string;
  remotely_accessible: boolean;
}

export interface ItemMapping {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type?: MediaType;
  image?: MediaItemImage | null;
}

export interface Artist {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "artist";
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Album {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "album";
  year?: number | null;
  artists?: (Artist | ItemMapping)[];
  album_type?: string;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Track {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "track";
  duration?: number;
  artists?: (Artist | ItemMapping)[];
  album?: Album | ItemMapping | null;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Playlist {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "playlist";
  owner?: string;
  is_editable?: boolean;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Radio {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "radio";
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Audiobook {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "audiobook";
  authors?: string[];
  narrators?: string[];
  duration?: number;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Podcast {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "podcast";
  publisher?: string | null;
  total_episodes?: number | null;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface PodcastEpisode {
  item_id: string;
  provider: string;
  name: string;
  version?: string;
  uri?: string;
  media_type: "podcast_episode";
  podcast?: Podcast | ItemMapping;
  duration?: number;
  favorite?: boolean;
  metadata?: MediaItemMetadata;
}

export interface Genre {
  item_id: string;
  provider: string;
  name: string;
  media_type: "genre";
  metadata?: MediaItemMetadata;
}

export interface MediaItemMetadata {
  description?: string | null;
  images?: MediaItemImage[] | null;
  genres?: string[] | null;
  release_date?: string | null;
  popularity?: number | null;
}

export type MediaType =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "radio"
  | "audiobook"
  | "podcast"
  | "podcast_episode"
  | "genre"
  | "folder";

export type MediaItem =
  | Artist
  | Album
  | Track
  | Playlist
  | Radio
  | Audiobook
  | Podcast
  | PodcastEpisode
  | Genre;

export interface SearchResults {
  artists: (Artist | ItemMapping)[];
  albums: (Album | ItemMapping)[];
  tracks: (Track | ItemMapping)[];
  playlists: (Playlist | ItemMapping)[];
  radio: (Radio | ItemMapping)[];
  audiobooks: (Audiobook | ItemMapping)[];
  podcasts: (Podcast | ItemMapping)[];
  genres: (Genre | ItemMapping)[];
}

export interface BrowseFolder {
  item_id: string;
  provider: string;
  name: string;
  media_type: "folder";
  path?: string;
  image?: MediaItemImage | null;
}

export interface PlayerSource {
  id: string;
  name: string;
  passive?: boolean;
  can_play_pause?: boolean;
  can_seek?: boolean;
  can_next_previous?: boolean;
}

export interface Player {
  player_id: string;
  provider: string;
  type: "player" | "stereo_pair" | "group" | "unknown";
  name: string;
  available: boolean;
  playback_state?: "idle" | "paused" | "playing" | "unknown";
  elapsed_time?: number | null;
  powered?: boolean | null;
  volume_level?: number | null;
  volume_muted?: boolean | null;
  current_media?: PlayerMedia | null;
  group_members?: string[];
  synced_to?: string | null;
  active_source?: string | null;
  source_list?: PlayerSource[];
}

export interface PlayerMedia {
  uri: string;
  media_type?: MediaType;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  image_url?: string | null;
  duration?: number | null;
}

export interface PlayerQueue {
  queue_id: string;
  active: boolean;
  display_name: string;
  available: boolean;
  items: number;
  shuffle_enabled?: boolean;
  repeat_mode?: "off" | "one" | "all" | "unknown";
  current_index?: number | null;
  elapsed_time?: number;
  state?: "idle" | "paused" | "playing" | "unknown";
  current_item?: QueueItem | null;
  next_item?: QueueItem | null;
}

export interface QueueItem {
  queue_id: string;
  queue_item_id: string;
  name: string;
  duration?: number | null;
  media_item?: Track | null;
  image?: MediaItemImage | null;
  index?: number;
}
