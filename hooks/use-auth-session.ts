"use client";

import { useEffect, useMemo, useState } from "react";

import { AuthUser, AUTH_STORAGE_KEYS } from "@/lib/api/auth";

interface SessionState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;
}

const initialSessionState: SessionState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  initialized: false,
};

function parseStoredUser(value: string | null): AuthUser | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

function readSessionState(): SessionState {
  if (typeof window === "undefined") {
    return initialSessionState;
  }

  const user = parseStoredUser(
    window.localStorage.getItem(AUTH_STORAGE_KEYS.user)
  );

  return {
    user,
    accessToken: window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
    initialized: true,
  };
}

export function useAuthSession() {
  const [session, setSession] = useState<SessionState>(initialSessionState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSession = () => {
      setSession(readSessionState());
    };

    updateSession();

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key &&
        Object.values(AUTH_STORAGE_KEYS).includes(event.key)
      ) {
        updateSession();
      }

      if (event.key === null && event.storageArea === window.localStorage) {
        updateSession();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const displayName = useMemo(() => {
    return session.user?.name ?? session.user?.email ?? null;
  }, [session.user]);

  const initials = useMemo(() => {
    if (!displayName) return null;
    const tokens = displayName.split(" ").filter(Boolean);
    if (!tokens.length) return displayName.slice(0, 2).toUpperCase();
    return tokens
      .map((token) => token[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  return {
    ...session,
    displayName,
    initials,
    isAuthenticated: Boolean(session.accessToken),
  };
}
