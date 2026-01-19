import type { Event } from 'nostr-tools';

import { encodeNaddr } from './nostr';
import type { Product } from './types';
import { DEFAULT_RELAYS } from './types';

// Parse a NIP-99 kind 30402 event into a Product
export function parseClassifiedListing(event: Event): Product | null {
  if (event.kind !== 30402) return null;

  const tags = event.tags;

  // Get required fields from tags
  const dTag = getTagValue(tags, 'd');
  const title = getTagValue(tags, 'title') || getTagValue(tags, 'name');
  const priceTag = tags.find((t) => t[0] === 'price');

  if (!dTag || !title) return null;

  // Parse price
  let price: { amount: string; currency: string; frequency?: string } = {
    amount: '0',
    currency: 'sats',
  };

  if (priceTag) {
    price = {
      amount: priceTag[1] || '0',
      currency: priceTag[2] || 'sats',
      frequency: priceTag[3],
    };
  }

  // Get images
  const images: string[] = [];
  for (const tag of tags) {
    if (tag[0] === 'image' || tag[0] === 'thumb') {
      images.push(tag[1]);
    }
  }

  // Get summary
  const summary =
    getTagValue(tags, 'summary') || getTagValue(tags, 'description') || event.content.slice(0, 200);

  // Get location
  const location = getTagValue(tags, 'location') || getTagValue(tags, 'g');

  // Get hashtags
  const hashtags: string[] = [];
  for (const tag of tags) {
    if (tag[0] === 't') {
      hashtags.push(tag[1]);
    }
  }

  // Generate naddr
  const naddr = encodeNaddr(event.pubkey, 30402, dTag, DEFAULT_RELAYS);

  return {
    id: event.id,
    pubkey: event.pubkey,
    title,
    summary,
    content: event.content,
    images,
    price,
    location,
    publishedAt: event.created_at,
    naddr,
    tags: hashtags,
  };
}

// Helper to get a tag value
function getTagValue(tags: string[][], tagName: string): string | undefined {
  const tag = tags.find((t) => t[0] === tagName);
  return tag ? tag[1] : undefined;
}

// Format price for display
export function formatPrice(amount: string, currency: string): string {
  const num = parseFloat(amount);

  if (currency.toLowerCase() === 'sats' || currency.toLowerCase() === 'sat') {
    if (num >= 1000000) {
      return `${(num / 100000000).toFixed(8)} BTC`;
    }
    return `${num.toLocaleString()} sats`;
  }

  if (currency.toLowerCase() === 'btc') {
    return `${num} BTC`;
  }

  if (currency.toLowerCase() === 'usd') {
    return `$${num.toFixed(2)}`;
  }

  return `${num} ${currency}`;
}

// Format relative time
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;

  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
}

// Get placeholder image if none available
export function getProductImage(images: string[]): string {
  if (images.length > 0) {
    return images[0];
  }
  // Return a placeholder
  return '/images/placeholder-product.svg';
}

// Sort products by date (newest first)
export function sortProductsByDate(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.publishedAt - a.publishedAt);
}

// Filter products by search term
export function filterProductsBySearch(products: Product[], search: string): Product[] {
  if (!search.trim()) return products;

  const term = search.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(term) ||
      p.summary.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term))
  );
}
