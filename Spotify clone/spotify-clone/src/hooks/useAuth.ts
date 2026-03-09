/**
 * useAuth Hook
 * Custom hook for authentication state management
 */

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import type { SpotifyUser } from "@/types/spotify";

interface UseAuthReturn {
  /** The authenticated user's Spotify profile */
  user: SpotifyUser | null;
  /** The current access token for API requests */
  accessToken: string | null;
  /** Whether the session is currently loading */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Any authentication errors */
  error: string | null;
  /** Sign out the current user */
  logout: () => Promise<void>;
}

/**
 * Custom hook for managing authentication state
 * 
 * @returns Authentication state and utilities
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const error = (session as { error?: string })?.error ?? null;

  // Automatically sign out if token refresh fails
  useEffect(() => {
    if ((session as { error?: string })?.error === "RefreshAccessTokenError") {
      signOut({ redirect: true, callbackUrl: "/login" });
    }
  }, [session]);

  // Extract user data from session
  const user: SpotifyUser | null = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        display_name: session.user.name ?? null,
        email: (session.user as { email?: string }).email,
        images: (session.user as { image?: string }).image
          ? [{ url: (session.user as { image?: string }).image!, height: null, width: null }]
          : [],
        followers: { href: null, total: 0 },
        product: "premium" as const,
        country: "",
        uri: "",
        type: "user" as const,
        external_urls: { spotify: "" },
      }
    : null;

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return {
    user,
    accessToken: (session as { accessToken?: string })?.accessToken ?? null,
    isLoading,
    isAuthenticated,
    error,
    logout,
  };
}

/**
 * Hook to check if user has premium subscription
 */
export function usePremiumCheck(): boolean {
  const { user } = useAuth();
  return user?.product === "premium";
}

/**
 * Hook to get user's display name with fallback
 */
export function useUserName(): string {
  const { user } = useAuth();
  return user?.display_name ?? user?.email ?? "User";
}
