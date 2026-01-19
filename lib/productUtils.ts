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

// Group cart items by seller pubkey
export interface SellerOrder {
  sellerPubkey: string;
  sellerName: string;
  sellerPicture?: string;
  items: Array<{
    product: Product;
    quantity: number;
    satsAmount: number;
  }>;
  subtotalSats: number;
  shippingSats: number;
  totalSats: number;
}

export function groupCartBySeller(
  items: Array<{ product: Product; quantity: number }>,
  convertToSats: (amount: number, currency: string) => number,
  sellerMetadata?: Record<string, { name: string; specialty?: string }>
): SellerOrder[] {
  const sellerMap = new Map<string, SellerOrder>();

  for (const item of items) {
    const sellerPubkey = item.product.pubkey;

    if (!sellerMap.has(sellerPubkey)) {
      // Get seller name from product, metadata, or default
      const sellerName =
        item.product.seller?.displayName ||
        item.product.seller?.name ||
        sellerMetadata?.[sellerPubkey]?.name ||
        `Seller ${sellerPubkey.slice(0, 8)}...`;

      sellerMap.set(sellerPubkey, {
        sellerPubkey,
        sellerName,
        sellerPicture: item.product.seller?.picture,
        items: [],
        subtotalSats: 0,
        shippingSats: 0,
        totalSats: 0,
      });
    }

    const sellerOrder = sellerMap.get(sellerPubkey)!;
    const amount = parseFloat(item.product.price.amount) || 0;
    const currency = item.product.price.currency;
    const satsAmount = convertToSats(amount, currency);

    sellerOrder.items.push({
      product: item.product,
      quantity: item.quantity,
      satsAmount,
    });

    sellerOrder.subtotalSats += satsAmount * item.quantity;
  }

  // Calculate totals for each seller
  const orders = Array.from(sellerMap.values());
  for (const order of orders) {
    // Shipping is calculated per seller - default 5000 sats (~£3.50) per seller
    // This could be made configurable per seller in the future
    order.shippingSats = 5000;
    order.totalSats = order.subtotalSats + order.shippingSats;
  }

  return orders;
}

// Calculate grand total from all seller orders
export function calculateGrandTotal(orders: SellerOrder[]): {
  subtotalSats: number;
  shippingSats: number;
  totalSats: number;
} {
  return orders.reduce(
    (acc, order) => ({
      subtotalSats: acc.subtotalSats + order.subtotalSats,
      shippingSats: acc.shippingSats + order.shippingSats,
      totalSats: acc.totalSats + order.totalSats,
    }),
    { subtotalSats: 0, shippingSats: 0, totalSats: 0 }
  );
}
