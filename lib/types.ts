// Nostr NIP-99 Classified Listing types
export interface Product {
  id: string;
  pubkey: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  price: {
    amount: string;
    currency: string;
    frequency?: string;
  };
  location?: string;
  publishedAt: number;
  naddr: string;
  tags: string[];
  seller?: SellerProfile;
}

export interface SellerProfile {
  pubkey: string;
  name?: string;
  displayName?: string;
  picture?: string;
  banner?: string;
  about?: string;
  nip05?: string;
  npub: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// NIP-99 kind 30402 event structure
export interface ClassifiedListingEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: 30402;
  tags: string[][];
  content: string;
  sig: string;
}

// Gamma Markets Order types (kind 16/17)
export interface OrderEvent {
  kind: 16 | 17;
  pubkey: string;
  created_at: number;
  tags: string[][];
  content: string;
}

export interface Order {
  id: string;
  buyerPubkey: string;
  sellerPubkey: string;
  productId: string;
  amount: string;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  createdAt: number;
  shippingAddress?: string;
  message?: string;
}

// Relay configuration
export const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.primal.net',
];

// Gini3D Store Identity
export const GINI3D_PUBKEY =
  process.env.NEXT_PUBLIC_GINI3D_PUBKEY ||
  'd887f1a249412f06d7c043d70aca17d326ba0d26ddfa1793d7bab5a141737412';
export const GINI3D_NPUB =
  process.env.NEXT_PUBLIC_GINI3D_NPUB ||
  'npub1mzrlrgjfgyhsd47qg0ts4jsh6vnt5rfxmhap0y7hh266zstnwsfqj2nr3d';

// Seller whitelist from environment (comma-separated pubkeys)
// This controls which sellers' products are displayed on the site
const sellerWhitelistEnv = process.env.NEXT_PUBLIC_SELLER_WHITELIST || GINI3D_PUBKEY;
export const FEATURED_SELLERS = sellerWhitelistEnv.split(',').filter((s) => s.trim());

// Seller metadata for display (fallback names for known sellers)
// Note: The primary source for seller names is their Nostr profile (kind 0)
// This is only used as a fallback if the profile isn't available
export const SELLER_METADATA: Record<string, { name: string; specialty: string; npub?: string }> = {
  d887f1a249412f06d7c043d70aca17d326ba0d26ddfa1793d7bab5a141737412: {
    name: 'Gini3D',
    specialty: 'Cute & Colorful Prints',
  },
  '211f325b5396968ac0c79b7c0a030d768206d32ac61f93f143de112b859bd46f': {
    name: 'Robotechy',
    specialty: 'Bitcoin Hardware & 3D Prints',
    npub: 'npub1yy0nyk6nj6tg4sx8nd7q5qcdw6pqd5e2cc0e8u2rmcgjhpvm63hsk67xe5',
  },
};
