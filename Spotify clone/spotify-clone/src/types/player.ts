/**
 * Player Types
 * Type definitions for the Spotify Web Playback SDK and player state
 */

import type { SpotifyTrack, SpotifyEpisode, SpotifyPlaybackContext } from "./spotify";

// ============================================================================
// Repeat State
// ============================================================================

export type RepeatState = "off" | "context" | "track";

// ============================================================================
// Player State
// ============================================================================

export interface PlayerState {
  /** The currently playing track or episode */
  currentTrack: SpotifyTrack | SpotifyEpisode | null;
  /** Whether the player is currently playing */
  isPlaying: boolean;
  /** Current progress in milliseconds */
  progressMs: number | null;
  /** Total duration of the current track in milliseconds */
  durationMs: number | null;
  /** Whether shuffle mode is enabled */
  shuffleState: boolean;
  /** Current repeat state */
  repeatState: RepeatState;
  /** Current volume percentage (0-100) */
  volumePercent: number | null;
  /** Whether the player is muted */
  isMuted: boolean;
  /** The ID of the active device */
  deviceId: string | null;
  /** Whether the player is ready to play */
  isPlayerReady: boolean;
  /** URI of the current context (playlist, album, etc.) */
  contextUri: string | null;
  /** Type of the current context */
  contextType: SpotifyPlaybackContext["type"];
}

// ============================================================================
// Player Initialization
// ============================================================================

export interface PlayerInitOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}

// ============================================================================
// Player Events
// ============================================================================

export interface PlayerStateChangeEvent {
  disabled: boolean;
  device: SpotifyDevice;
  position: number;
  duration: number;
  paused: boolean;
  track_window?: {
    current_track: SpotifyTrack | null;
    next_tracks: SpotifyTrack[];
    previous_tracks: SpotifyTrack[];
  };
  track: SpotifyTrack | null;
  playbackId?: string;
  playbackQuality?: {
    bitrate?: number;
  };
  restrictions?: {
    can_pause: boolean;
    can_peek: boolean;
    can_seek: boolean;
    can_skip_next: boolean;
    can_skip_prev: boolean;
  };
}

export interface PlayerError {
  message: string;
  error: {
    message: string;
    reason: string;
  };
}

// ============================================================================
// Spotify Device (from API)
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

// ============================================================================
// Player Controls
// ============================================================================

export interface PlayerControls {
  togglePlay: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setRepeat: (mode: RepeatState) => Promise<void>;
  setShuffle: (shuffle: boolean) => Promise<void>;
  transferPlayback: (deviceId: string, play?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
}

// ============================================================================
// Playback Actions (from API)
// ============================================================================

export interface PlaybackActions {
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

// ============================================================================
// Now Playing View
// ============================================================================

export interface NowPlayingView {
  isOpen: boolean;
  isFullscreen: boolean;
}

// ============================================================================
// Lyrics
// ============================================================================

export interface LyricsLine {
  startTimeMs: number;
  words: string;
  syllables?: string[];
  endTimeMs?: number;
}

export interface Lyrics {
  syncType: "LINE_SYNCED" | "UNSYNCED" | "NOT_SYNCED";
  lines: LyricsLine[];
  provider: string;
  providerLyricsId: string;
  providerDisplayName: string;
  syncLyricsUri: string;
  isDenseType: boolean;
  alternatives: unknown[];
  showUpsell: boolean;
  language: string;
  isRtlLanguage: boolean;
  fullscreenAction: "FULLSCREEN_LYRICS" | "FULLSCREEN_VIDEO" | "NONE";
}

export interface LyricsState {
  isLoading: boolean;
  lyrics: Lyrics | null;
  error: string | null;
  currentTimeMs: number;
  isFullscreen: boolean;
}

// ============================================================================
// Queue View
// ============================================================================

export interface QueueState {
  isOpen: boolean;
  currentlyPlaying: SpotifyTrack | null;
  upcoming: SpotifyTrack[];
  isLoading: boolean;
}
