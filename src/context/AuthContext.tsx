/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Permission } from '../config/permissions';
import type { WorkspaceRole } from '../config/segments';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: WorkspaceRole[];
  permissions: Permission[];
  unitScopes: string[];
  teamScopes: string[];
  featureAccess: string[];
  delegations: string[];
}

interface SessionInfo {
  id: string;
  createdAt: string;
  expiresAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SessionResponse {
  authenticated: boolean;
  session?: SessionInfo;
  user?: {
    subjectId: string;
    displayName: string;
    email: string;
    roles: WorkspaceRole[];
    permissions: Permission[];
    unitScopes: string[];
    teamScopes: string[];
    featureAccess: string[];
    delegations: string[];
  };
}

function mapSessionResponse(payload: SessionResponse): { user: AuthUser | null; session: SessionInfo | null } {
  if (!payload.authenticated || !payload.user || !payload.session) {
    return { user: null, session: null };
  }

  return {
    session: payload.session,
    user: {
      id: payload.user.subjectId,
      name: payload.user.displayName,
      email: payload.user.email,
      roles: payload.user.roles,
      permissions: payload.user.permissions,
      unitScopes: payload.user.unitScopes,
      teamScopes: payload.user.teamScopes,
      featureAccess: payload.user.featureAccess,
      delegations: payload.user.delegations,
    },
  };
}

function getReturnTo() {
  const currentPath = `${window.location.pathname}${window.location.search}`;
  return currentPath === '/login' ? '/home' : currentPath;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/session/me', {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });

      if (response.status === 401) {
        setUser(null);
        setSession(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Session check failed with status ${response.status}`);
      }

      const payload = (await response.json()) as SessionResponse;
      const mapped = mapSessionResponse(payload);
      setUser(mapped.user);
      setSession(mapped.session);
    } catch (error) {
      console.error('Unable to refresh auth session', error);
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => {
      setIsLoading(false);
    });
  }, [refreshSession]);

  const signInWithMicrosoft = useCallback(async () => {
    const returnTo = encodeURIComponent(getReturnTo());
    window.location.assign(`/auth/login?returnTo=${returnTo}`);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
      setUser(null);
      setSession(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: user !== null,
        isLoading,
        signInWithMicrosoft,
        signOut,
        refreshSession,
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
