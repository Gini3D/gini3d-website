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

        // Fetch the specific event
        const filter = {
          kinds: [kind],
          authors: [pubkey],
          '#d': [identifier],
          limit: 1,
        };

        const events = await fetchEvents(filter, DEFAULT_RELAYS);

        if (events.length === 0) {
          throw new Error('Product not found');
        }

        const parsed = parseClassifiedListing(events[0]);
        if (!parsed) {
          throw new Error('Failed to parse product');
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
