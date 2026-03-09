/**
 * Providers Component
 * Wraps the application with all necessary context providers
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Creates a new QueryClient instance with optimal settings
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Retry failed requests once
        retry: 1,
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: "always",
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

/**
 * Browser-only QueryClient singleton
 * Prevents creating multiple instances during SSR
 */
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Main Providers component that wraps the entire application
 * 
 * Provides:
 * - SessionProvider (NextAuth)
 * - QueryClientProvider (React Query)
 * - ReactQueryDevtools (development only)
 */
export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* React Query Devtools - only in development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
