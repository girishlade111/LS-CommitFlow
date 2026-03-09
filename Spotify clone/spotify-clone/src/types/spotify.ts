/**
 * Spotify API TypeScript Types
 * Complete type definitions for all Spotify API objects
 */

// ============================================================================
// Base Types
// ============================================================================

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifyCopyright {
  text: string;
  type: "C" | "P";
}

export interface SpotifyLinkedTrack {
  id: string;
  uri: string;
  type: "track";
  external_urls: SpotifyExternalUrls;
}

// ============================================================================
// Artist Types
// ============================================================================

export interface SpotifySimplifiedArtist {
  id: string;
  name: string;
  uri: string;
  type: "artist";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  followers: SpotifyFollowers;
  popularity: number;
  uri: string;
  type: "artist";
  external_urls: SpotifyExternalUrls;
}

// ============================================================================
// Album Types
// ============================================================================

export interface SpotifySimplifiedAlbum {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation" | "appears_on";
  artists: SpotifySimplifiedArtist[];
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  uri: string;
  type: "album";
  external_urls: SpotifyExternalUrls;
  available_markets?: string[];
  restrictions?: {
    reason: "market" | "product" | "explicit";
  };
}

export interface SpotifyAlbum extends SpotifySimplifiedAlbum {
  tracks: SpotifyPagingObject<SpotifySimplifiedTrack>;
  label: string;
  copyrights: SpotifyCopyright[];
  genres: string[];
  popularity: number;
}

// ============================================================================
// Track Types
// ============================================================================

export interface SpotifySimplifiedTrack {
  id: string;
  name: string;
  artists: SpotifySimplifiedArtist[];
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  uri: string;
  type: "track";
  is_playable: boolean;
  is_local: boolean;
  external_urls: SpotifyExternalUrls;
  linked_from?: SpotifyLinkedTrack;
  restrictions?: {
    reason: "market" | "product" | "explicit";
  };
}

export interface SpotifyTrack extends SpotifySimplifiedTrack {
  album: SpotifyAlbum;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  disc_number: number;
}

// ============================================================================
// Playlist Types
// ============================================================================

export interface SpotifyPlaylistOwner {
  id: string;
  display_name: string | null;
  uri: string;
  type: "user";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyPlaylistTrackItem {
  added_at: string;
  added_by: SpotifyPlaylistOwner;
  is_local: boolean;
  track: SpotifyTrack | SpotifyEpisode | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: SpotifyPlaylistOwner;
  tracks: SpotifyPagingObject<SpotifyPlaylistTrackItem>;
  public: boolean | null;
  collaborative: boolean;
  followers: SpotifyFollowers;
  uri: string;
  type: "playlist";
  external_urls: SpotifyExternalUrls;
  snapshot_id: string;
  primary_color?: string;
}

// ============================================================================
// User Types
// ============================================================================

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email?: string;
  images: SpotifyImage[];
  followers: SpotifyFollowers;
  product: "free" | "open" | "premium";
  country: string;
  uri: string;
  type: "user";
  external_urls: SpotifyExternalUrls;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
}

// ============================================================================
// Show & Episode Types
// ============================================================================

export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  publisher: string;
  images: SpotifyImage[];
  total_episodes: number;
  uri: string;
  type: "show";
  external_urls: SpotifyExternalUrls;
  available_markets?: string[];
  copyrights: SpotifyCopyright[];
  explicit: boolean;
  html_description: string;
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  html_description: string;
  duration_ms: number;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  uri: string;
  type: "episode";
  show: SpotifyShow;
  audio_preview_url: string | null;
  external_urls: SpotifyExternalUrls;
  explicit: boolean;
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  resume_point?: {
    fully_played: boolean;
    resume_position_ms: number;
  };
}

// ============================================================================
// Playback Types
// ============================================================================

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
}

export interface SpotifyPlaybackContext {
  type: "artist" | "playlist" | "album" | "show" | "episode" | "collection" | null;
  uri: string | null;
  external_urls?: SpotifyExternalUrls;
  href?: string;
}

export interface SpotifyPlaybackActions {
  disallows: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | SpotifyEpisode | null;
  context: SpotifyPlaybackContext | null;
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: "off" | "context" | "track";
  timestamp: number;
  actions: SpotifyPlaybackActions;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SpotifySearchResults {
  tracks?: SpotifyPagingObject<SpotifyTrack>;
  albums?: SpotifyPagingObject<SpotifySimplifiedAlbum>;
  artists?: SpotifyPagingObject<SpotifyArtist>;
  playlists?: SpotifyPagingObject<SpotifyPlaylist>;
  shows?: SpotifyPagingObject<SpotifyShow>;
  episodes?: SpotifyPagingObject<SpotifyEpisode>;
  audiobooks?: SpotifyPagingObject<unknown>;
}

// ============================================================================
// Recently Played Types
// ============================================================================

export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context: SpotifyPlaybackContext | null;
}

export interface SpotifyRecentlyPlayed {
  items: SpotifyRecentlyPlayedItem[];
  next: string | null;
  cursors: {
    after?: string;
    before?: string;
  };
  limit: number;
  href: string;
}

// ============================================================================
// Recommendations Types
// ============================================================================

export interface SpotifyRecommendationSeed {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string | null;
  id: string;
  initialPoolSize: number;
  type: "artist" | "track" | "genre";
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
  seeds: SpotifyRecommendationSeed[];
}

// ============================================================================
// Category Types
// ============================================================================

export interface SpotifyCategory {
  id: string;
  name: string;
  icons: SpotifyImage[];
  href: string;
}

export interface SpotifyCategoryPlaylists {
  playlists: SpotifyPagingObject<SpotifyPlaylist>;
}

// ============================================================================
// Queue Types
// ============================================================================

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
}

// ============================================================================
// Paging Object (Pagination)
// ============================================================================

export interface SpotifyPagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  href: string;
}

// ============================================================================
// Featured Content Types
// ============================================================================

export interface SpotifyFeaturedPlaylists {
  message: string;
  playlists: SpotifyPagingObject<SpotifyPlaylist>;
}

export interface SpotifyNewReleases {
  albums: SpotifyPagingObject<SpotifySimplifiedAlbum>;
}

export interface SpotifyTopArtists {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface SpotifyTopTracks {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

// ============================================================================
// Audio Features Types
// ============================================================================

export interface SpotifyAudioFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
  key: number;
  mode: number;
  tempo: number;
  loudness: number;
  energy: number;
  danceability: number;
  speechiness: number;
  acousticness: number;
  liveness: number;
  valence: number;
  instrumentalness: number;
}

export interface SpotifyAudioAnalysis {
  meta: {
    analyzer_version: string;
    platform: string;
    detailed_status: string;
    status_code: number;
    timestamp: number;
    analysis_time: number;
    input_process: string;
  };
  track: {
    num_samples: number;
    duration: number;
    sample_md5: string;
    offset_seconds: number;
    window_seconds: number;
    analysis_sample_rate: number;
    analysis_channels: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    codestring: string;
    code_version: number;
    echoprintstring: string;
    echoprint_version: number;
    synchstring: string;
    synch_version: number;
    rhythmstring: string;
    rhythm_version: number;
  };
  bars: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
  beats: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
  sections: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
  }>;
  segments: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness_start: number;
    loudness_max: number;
    loudness_max_time: number;
    loudness_end: number;
    pitches: number[];
    timbre: number[];
  }>;
  tatums: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
}

// ============================================================================
// Library Types
// ============================================================================

export interface SpotifySavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifySavedAlbum {
  added_at: string;
  album: SpotifyAlbum;
}

export interface SpotifySavedShow {
  added_at: string;
  show: SpotifyShow;
}

export interface SpotifySavedEpisode {
  added_at: string;
  episode: SpotifyEpisode;
}

export interface SpotifyFollowedArtist {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string;
  };
  total: number;
  items: Array<{
    id: string;
    name: string;
    type: "artist";
    uri: string;
    external_urls: SpotifyExternalUrls;
    followers: SpotifyFollowers;
    genres: string[];
    images: SpotifyImage[];
    popularity: number;
  }>;
}

// ============================================================================
// Export All Types
// ============================================================================

export type {
  SpotifySimplifiedTrack as SimplifiedTrack,
  SpotifySimplifiedAlbum as SimplifiedAlbum,
  SpotifySimplifiedArtist as SimplifiedArtist,
};
