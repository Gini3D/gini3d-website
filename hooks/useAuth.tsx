'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { pubkeyToNpub } from '@/lib/nostr';
import { fetchEvents } from '@/lib/nostr';
import { DEFAULT_RELAYS, SellerProfile } from '@/lib/types';

// NIP-07 window.nostr interface
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: object): Promise<object>;
      getRelays?(): Promise<Record<string, { read: boolean; write: boolean }>>;
      nip04?: {
        encrypt(pubkey: string, plaintext: string): Promise<string>;
        decrypt(pubkey: string, ciphertext: string): Promise<string>;
      };
    };
  }
}

interface AuthContextType {
  user: SellerProfile | null;
  isLoading: boolean;
  isExtensionAvailable: boolean;
  login: () => Promise<void>;
  loginWithKey: (nsec: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'gini3d_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for NIP-07 extension on mount
  useEffect(() => {
    const checkExtension = () => {
      setIsExtensionAvailable(!!window.nostr);
    };

    // Check immediately and after a delay (extensions may load slowly)
    checkExtension();
    const timeout = setTimeout(checkExtension, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch user profile from Nostr
  const fetchProfile = useCallback(async (pubkey: string): Promise<SellerProfile> => {
    try {
      const events = await fetchEvents(
        {
          kinds: [0],
          authors: [pubkey],
          limit: 1,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        DEFAULT_RELAYS
      );

      if (events.length > 0) {
        const profile = JSON.parse(events[0].content);
        return {
          pubkey,
          name: profile.name,
          displayName: profile.display_name || profile.displayName,
          picture: profile.picture,
          about: profile.about,
          nip05: profile.nip05,
          npub: pubkeyToNpub(pubkey),
        };
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }

    // Return basic profile if fetch fails
    return {
      pubkey,
      npub: pubkeyToNpub(pubkey),
    };
  }, []);

  // Login with NIP-07 extension
  const login = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!window.nostr) {
        throw new Error(
          'No Nostr extension found. Please install Alby, nos2x, or another NIP-07 extension.'
        );
      }

      const pubkey = await window.nostr.getPublicKey();
      const profile = await fetchProfile(pubkey);

      setUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Login with nsec key (NOT RECOMMENDED - for demo only)
  const loginWithKey = useCallback(
    async (nsec: string) => {
      setError(null);
      setIsLoading(true);

      try {
        // Import nostr-tools for key decoding
        const { nip19, getPublicKey } = await import('nostr-tools');

        let pubkey: string;

        if (nsec.startsWith('nsec1')) {
          const decoded = nip19.decode(nsec);
          if (decoded.type !== 'nsec') {
            throw new Error('Invalid nsec format');
          }
          pubkey = getPublicKey(decoded.data);
        } else {
          // Assume hex private key
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pubkey = getPublicKey(nsec as any);
        }

        const profile = await fetchProfile(pubkey);

        setUser(profile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));

        // Note: We don't store the private key for security
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid key';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile]
  );

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isExtensionAvailable,
        login,
        loginWithKey,
        logout,
        error,
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
