'use client';

import { SimplePool, nip19 } from 'nostr-tools';
import type { Event, Filter } from 'nostr-tools';

import { DEFAULT_RELAYS } from './types';

// Create a singleton pool instance
let poolInstance: SimplePool | null = null;

export function getPool(): SimplePool {
  if (!poolInstance) {
    poolInstance = new SimplePool();
  }
  return poolInstance;
}

// Fetch events from relays
export async function fetchEvents(
  filter: Filter,
  relays: string[] = DEFAULT_RELAYS
): Promise<Event[]> {
  const pool = getPool();
  const events = await pool.querySync(relays, filter);
  return events;
}

// Subscribe to events
export function subscribeToEvents(
  filter: Filter,
  onEvent: (event: Event) => void,
  relays: string[] = DEFAULT_RELAYS
) {
  const pool = getPool();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = pool.subscribeMany(relays, [filter] as any, {
    onevent: onEvent,
  });
  return sub;
}

// Encode naddr for product links
export function encodeNaddr(
  pubkey: string,
  kind: number,
  identifier: string,
  relays: string[] = DEFAULT_RELAYS
): string {
  return nip19.naddrEncode({
    pubkey,
    kind,
    identifier,
    relays: relays.slice(0, 2),
  });
}

// Decode naddr
export function decodeNaddr(naddr: string): {
  pubkey: string;
  kind: number;
  identifier: string;
  relays: string[];
} | null {
  try {
    const decoded = nip19.decode(naddr);
    if (decoded.type === 'naddr') {
      return {
        ...decoded.data,
        relays: decoded.data.relays || [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Convert pubkey to npub
export function pubkeyToNpub(pubkey: string): string {
  try {
    return nip19.npubEncode(pubkey);
  } catch {
    return pubkey;
  }
}

// Convert npub to pubkey
export function npubToPubkey(npub: string): string | null {
  try {
    const decoded = nip19.decode(npub);
    if (decoded.type === 'npub') {
      return decoded.data;
    }
    return null;
  } catch {
    return null;
  }
}

// Shorten pubkey for display
export function shortenPubkey(pubkey: string, length: number = 8): string {
  const npub = pubkeyToNpub(pubkey);
  if (npub.length <= length * 2 + 3) return npub;
  return `${npub.slice(0, length)}...${npub.slice(-length)}`;
}

// Cleanup pool connections
export function closePool() {
  if (poolInstance) {
    poolInstance.close(DEFAULT_RELAYS);
    poolInstance = null;
  }
}
