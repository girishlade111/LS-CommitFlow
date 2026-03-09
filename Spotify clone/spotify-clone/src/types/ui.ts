/**
 * UI Types
 * Type definitions for UI components, state, and interactions
 */

// ============================================================================
// Library Filter & Sort Types
// ============================================================================

export type LibraryFilter = "all" | "playlists" | "podcasts" | "artists" | "albums";

export type LibrarySort = "recents" | "recently-added" | "alphabetical" | "creator";

// ============================================================================
// Right Panel Types
// ============================================================================

export type RightPanel = "queue" | "lyrics" | "nowplaying" | null;

// ============================================================================
// Context Menu Types
// ============================================================================

export interface ContextMenuItem {
  /** The label to display for the menu item */
  label: string;
  /** Optional icon name/component for the menu item */
  icon?: React.ReactNode | string;
  /** Callback when the menu item is clicked */
  onClick: () => void;
  /** Whether this is a danger action (shown in red) */
  danger?: boolean;
  /** Whether to show a divider after this item */
  divider?: boolean;
  /** Submenu items (for nested menus) */
  subItems?: ContextMenuItem[];
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Whether the item is checked (for toggle items) */
  checked?: boolean;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  position: ContextMenuPosition | null;
  items: ContextMenuItem[];
  targetType: "track" | "album" | "artist" | "playlist" | "episode" | "show" | null;
  targetId: string | null;
  targetData?: unknown;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode | string;
  isActive?: boolean;
}

export interface NavState {
  currentPath: string;
  history: string[];
  historyIndex: number;
}

// ============================================================================
// Modal Types
// ============================================================================

export interface ModalConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export interface ModalState {
  isOpen: boolean;
  config: ModalConfig | null;
}

// ============================================================================
// Toast Types
// ============================================================================

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchState {
  query: string;
  isLoading: boolean;
  results: {
    tracks: unknown[];
    albums: unknown[];
    artists: unknown[];
    playlists: unknown[];
    shows: unknown[];
    episodes: unknown[];
  };
  recentSearches: string[];
  topResults: unknown[];
}

// ============================================================================
// Home Page Types
// ============================================================================

export interface GreetingConfig {
  greeting: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export interface Section {
  title: string;
  href?: string;
  items: unknown[];
  type: "playlist" | "album" | "artist" | "episode" | "show";
}

// ============================================================================
// Sidebar Types
// ============================================================================

export interface SidebarState {
  isCollapsed: boolean;
  isResizing: boolean;
  width: number;
}

// ============================================================================
// Player Bar Types
// ============================================================================

export interface PlayerBarState {
  isExpanded: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
}

// ============================================================================
// Loading States
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  isInitialLoad: boolean;
}

// ============================================================================
// Scroll Position
// ============================================================================

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ScrollState {
  position: ScrollPosition;
  isScrolling: boolean;
  direction: "up" | "down" | "left" | "right" | null;
}

// ============================================================================
// Drag and Drop Types
// ============================================================================

export interface DragItem {
  type: "track" | "playlist" | "album";
  id: string;
  data: unknown;
  index?: number;
}

export interface DropResult {
  type: "playlist" | "queue";
  id: string;
  index: number;
}

// ============================================================================
// Responsive Breakpoints
// ============================================================================

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export interface BreakpointValues {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export const breakpoints: BreakpointValues = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// ============================================================================
// Theme Types
// ============================================================================

export type ColorScheme = "dark" | "light" | "system";

export interface ThemeConfig {
  colorScheme: ColorScheme;
  accentColor: string;
}

// ============================================================================
// View Transition Types
// ============================================================================

export interface ViewTransition {
  type: "fade" | "slide" | "scale" | "none";
  duration: number;
}

// ============================================================================
// Keyboard Shortcut Types
// ============================================================================

export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "shift" | "alt" | "meta")[];
  action: () => void;
  description: string;
  category: "playback" | "navigation" | "volume" | "general";
}

// ============================================================================
// Tooltip Types
// ============================================================================

export interface TooltipConfig {
  content: string;
  position: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
}

// ============================================================================
// Image Loading Types
// ============================================================================

export interface ImageLoadingState {
  isLoading: boolean;
  error: boolean;
  loaded: boolean;
}

// ============================================================================
// Equalizer Animation Types
// ============================================================================

export interface EqualizerState {
  isAnimating: boolean;
  bars: number[];
}
