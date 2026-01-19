'use client';

import { useCallback, useEffect, useState } from 'react';

import { fetchEvents } from '@/lib/nostr';
import { parseClassifiedListing, sortProductsByDate } from '@/lib/productUtils';
import type { Product } from '@/lib/types';
import { DEFAULT_RELAYS } from '@/lib/types';

interface UseProductsOptions {
  sellers?: string[]; // Filter by specific seller pubkeys
  tags?: string[]; // Filter by tags
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build filter for NIP-99 classified listings (kind 30402)
      const filter: {
        kinds: number[];
        authors?: string[];
        '#t'?: string[];
        limit?: number;
      } = {
        kinds: [30402],
        limit: options.limit || 100,
      };

      // Filter by sellers if specified
      if (options.sellers && options.sellers.length > 0) {
        filter.authors = options.sellers;
      }

      // Filter by tags if specified
      if (options.tags && options.tags.length > 0) {
        filter['#t'] = options.tags;
      }

      const events = await fetchEvents(filter, DEFAULT_RELAYS);

      // Parse events into products
      const parsedProducts = events
        .map(parseClassifiedListing)
        .filter((p): p is Product => p !== null);

      // Sort by date
      const sortedProducts = sortProductsByDate(parsedProducts);

      setProducts(sortedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [options.sellers, options.tags, options.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

// Hook to fetch a single product by naddr
export function useProduct(naddr: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        // Decode naddr to get pubkey, kind, and identifier
        const { nip19 } = await import('nostr-tools');
        const decoded = nip19.decode(naddr);

        if (decoded.type !== 'naddr') {
          throw new Error('Invalid naddr');
        }

        const { pubkey, kind, identifier } = decoded.data;

        // Fetch the product event and seller profile in parallel
        const [productEvents, profileEvents] = await Promise.all([
          fetchEvents(
            {
              kinds: [kind],
              authors: [pubkey],
              '#d': [identifier],
              limit: 1,
            },
            DEFAULT_RELAYS
          ),
          fetchEvents(
            {
              kinds: [0], // Profile metadata
              authors: [pubkey],
              limit: 1,
            },
            DEFAULT_RELAYS
          ),
        ]);

        if (productEvents.length === 0) {
          throw new Error('Product not found');
        }

        const parsed = parseClassifiedListing(productEvents[0]);
        if (!parsed) {
          throw new Error('Failed to parse product');
        }

        // Add seller profile if available
        if (profileEvents.length > 0) {
          try {
            const profileData = JSON.parse(profileEvents[0].content);
            const npub = nip19.npubEncode(pubkey);
            parsed.seller = {
              pubkey,
              name: profileData.name,
              displayName: profileData.display_name || profileData.displayName,
              picture: profileData.picture,
              banner: profileData.banner,
              about: profileData.about,
              nip05: profileData.nip05,
              npub,
            };
          } catch {
            // Profile parsing failed, continue without seller info
          }
        }

        setProduct(parsed);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    if (naddr) {
      fetchProduct();
    }
  }, [naddr]);

  return { product, loading, error };
}
