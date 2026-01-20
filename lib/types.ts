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

// Gini3D Store Identity (from environment)
export const GINI3D_PUBKEY = process.env.NEXT_PUBLIC_GINI3D_PUBKEY!;
export const GINI3D_NPUB = process.env.NEXT_PUBLIC_GINI3D_NPUB!;

// Seller whitelist from environment (comma-separated pubkeys)
// This controls which sellers' products are displayed on the site
const sellerWhitelistEnv = process.env.NEXT_PUBLIC_SELLER_WHITELIST!;
export const FEATURED_SELLERS = sellerWhitelistEnv.split(',').filter((s) => s.trim());
