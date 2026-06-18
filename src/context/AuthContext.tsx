/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Auth is established by the BFF (Microsoft Entra ID + DWS authorization).
 * The browser holds no Entra token; it only reads the resolved session context
 * from GET /api/session/me. Sign-in / sign-out are top-level navigations to the
 * BFF so the httpOnly session cookie is set/cleared by the server.
 * See docs/architecture/llad-cross-cutting-iam-v1.0-draft.md (ADR-DWS01-IAM-009..012).
 */

const SESSION_ENDPOINT = '/api/session/me';
const LOGIN_ENDPOINT = '/auth/login';
const LOGOUT_ENDPOINT = '/auth/logout';

export interface AuthUser {
  id: string | null;
  name: string;
  email: string;
  workspaceSegment: string;
  roles: string[];
  permissions: string[];
  unit: string | null;
  team: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  permissions: string[];
  signInWithMicrosoft: (returnTo?: string) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SessionResponse {
  authenticated: boolean;
  user?: {
    id: string | null;
    name: string;
    email: string;
    workspaceSegment: string;
    roles: string[];
    permissions: string[];
    unit: string | null;
    team: string | null;
  };
}

async function fetchSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch(SESSION_ENDPOINT, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as SessionResponse;
    if (!data.authenticated || !data.user) return null;
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      workspaceSegment: data.user.workspaceSegment,
      roles: data.user.roles ?? [],
      permissions: data.user.permissions ?? [],
      unit: data.user.unit ?? null,
      team: data.user.team ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const session = await fetchSession();
    setUser(session);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const session = await fetchSession();
      if (active) {
        setUser(session);
        setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signInWithMicrosoft = useCallback(async (returnTo = '/home') => {
    // Full-page navigation: the BFF starts the Entra flow and returns here.
    window.location.assign(`${LOGIN_ENDPOINT}?returnTo=${encodeURIComponent(returnTo)}`);
  }, []);

  const signOut = useCallback(() => {
    window.location.assign(LOGOUT_ENDPOINT);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        roles: user?.roles ?? [],
        permissions: user?.permissions ?? [],
        signInWithMicrosoft,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
