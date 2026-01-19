'use client';

import { useCallback, useEffect, useState } from 'react';

import { fetchEvents } from '@/lib/nostr';
import { DEFAULT_RELAYS } from '@/lib/types';
import type { Stall, StallShippingZone } from '@/lib/cartTypes';

// Parse a NIP-15 kind 30017 stall event
function parseStallEvent(event: { pubkey: string; content: string; tags: string[][] }): Stall | null {
  try {
    const content = JSON.parse(event.content);

    // Get the d-tag (stall ID)
    const dTag = event.tags.find((t) => t[0] === 'd');
    const stallId = dTag?.[1] || content.id;

    if (!stallId || !content.name) return null;

    // Parse shipping zones
    const shipping: StallShippingZone[] = (content.shipping || []).map((zone: {
      id: string;
      name?: string;
      cost: number;
      regions?: string[];
    }) => ({
      id: zone.id,
      name: zone.name,
      cost: typeof zone.cost === 'number' ? zone.cost : parseFloat(zone.cost) || 0,
      regions: zone.regions || [],
    }));

    return {
      id: stallId,
      pubkey: event.pubkey,
      name: content.name,
      description: content.description,
      currency: content.currency || 'sats',
      shipping,
    };
  } catch {
    return null;
  }
}

// Hook to fetch stalls for multiple sellers
export function useStalls(sellerPubkeys: string[]) {
  const [stalls, setStalls] = useState<Map<string, Stall[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStalls = useCallback(async () => {
    if (sellerPubkeys.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch stall events (kind 30017) for all sellers
      const events = await fetchEvents(
        {
          kinds: [30017],
          authors: sellerPubkeys,
        },
        DEFAULT_RELAYS
      );

      // Group stalls by seller pubkey
      const stallMap = new Map<string, Stall[]>();

      for (const event of events) {
        const stall = parseStallEvent(event);
        if (stall) {
          const existing = stallMap.get(event.pubkey) || [];
          existing.push(stall);
          stallMap.set(event.pubkey, existing);
        }
      }

      setStalls(stallMap);
    } catch (err) {
      console.error('Failed to fetch stalls:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stalls');
    } finally {
      setLoading(false);
    }
  }, [sellerPubkeys]);

  useEffect(() => {
    fetchStalls();
  }, [fetchStalls]);

  // Get all shipping options for a specific seller
  const getSellerShipping = useCallback((pubkey: string): StallShippingZone[] => {
    const sellerStalls = stalls.get(pubkey) || [];
    // Combine shipping from all stalls (usually a seller has one stall)
    const allShipping: StallShippingZone[] = [];
    for (const stall of sellerStalls) {
      allShipping.push(...stall.shipping);
    }
    return allShipping;
  }, [stalls]);

  // Get stall currency for a seller
  const getSellerCurrency = useCallback((pubkey: string): string => {
    const sellerStalls = stalls.get(pubkey) || [];
    return sellerStalls[0]?.currency || 'sats';
  }, [stalls]);

  return {
    stalls,
    loading,
    error,
    refetch: fetchStalls,
    getSellerShipping,
    getSellerCurrency,
  };
}
