/**
 * VibeShare — Clerk Hook Wrappers
 * Provides safe access to Clerk hooks that work during SSR and CSR.
 */

import { useUser, useAuth } from "@clerk/nextjs";

/**
 * Wrapper around Clerk's useUser hook.
 */
export function useSafeUser() {
  try {
    return useUser();
  } catch {
    return { isSignedIn: false, user: null, isLoaded: true };
  }
}

/**
 * Wrapper around Clerk's useAuth hook.
 */
export function useSafeAuth() {
  try {
    return useAuth();
  } catch {
    return { getToken: async () => null, isSignedIn: false, userId: null };
  }
}
