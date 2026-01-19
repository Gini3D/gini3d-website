// Exchange rate service for converting between fiat and Bitcoin
// Fetches rates from Kraken and Coinbase APIs

const KRAKEN_URL =
  process.env.NEXT_PUBLIC_EXCHANGE_KRAKEN_URL ||
  'https://api.kraken.com/0/public/Ticker?pair=XBTGBP';

const COINBASE_URL =
  process.env.NEXT_PUBLIC_EXCHANGE_COINBASE_URL ||
  'https://api.coinbase.com/v2/prices/BTC-GBP/spot';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface ExchangeRateCache {
  rate: number; // BTC price in GBP
  timestamp: number;
  source: string;
}

let cache: ExchangeRateCache | null = null;

// Kraken API response structure
interface KrakenResponse {
  error: string[];
  result: {
    XXBTZGBP?: {
      c: [string, string]; // Last trade closed [price, lot volume]
    };
  };
}

// Coinbase API response structure
interface CoinbaseResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

/**
 * Fetch BTC/GBP rate from Kraken
 */
async function fetchKrakenRate(): Promise<number | null> {
  try {
    const response = await fetch(KRAKEN_URL);
    if (!response.ok) return null;

    const data: KrakenResponse = await response.json();
    if (data.error?.length > 0) return null;

    const ticker = data.result?.XXBTZGBP;
    if (!ticker?.c?.[0]) return null;

    return parseFloat(ticker.c[0]);
  } catch (error) {
    console.error('Failed to fetch Kraken rate:', error);
    return null;
  }
}

/**
 * Fetch BTC/GBP rate from Coinbase
 */
async function fetchCoinbaseRate(): Promise<number | null> {
  try {
    const response = await fetch(COINBASE_URL);
    if (!response.ok) return null;

    const data: CoinbaseResponse = await response.json();
    if (!data.data?.amount) return null;

    return parseFloat(data.data.amount);
  } catch (error) {
    console.error('Failed to fetch Coinbase rate:', error);
    return null;
  }
}

/**
 * Get BTC/GBP exchange rate (averaged from multiple sources)
 * Returns the BTC price in GBP
 */
export async function getBtcGbpRate(): Promise<{ rate: number; source: string } | null> {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return { rate: cache.rate, source: cache.source };
  }

  // Fetch from both sources in parallel
  const [krakenRate, coinbaseRate] = await Promise.all([
    fetchKrakenRate(),
    fetchCoinbaseRate(),
  ]);

  // Calculate average or use single source
  let rate: number | null = null;
  let source = '';

  if (krakenRate && coinbaseRate) {
    rate = (krakenRate + coinbaseRate) / 2;
    source = 'Kraken + Coinbase average';
  } else if (krakenRate) {
    rate = krakenRate;
    source = 'Kraken';
  } else if (coinbaseRate) {
    rate = coinbaseRate;
    source = 'Coinbase';
  }

  if (rate === null) {
    // Return cached rate if available, even if stale
    if (cache) {
      return { rate: cache.rate, source: `${cache.source} (cached)` };
    }
    return null;
  }

  // Update cache
  cache = {
    rate,
    timestamp: Date.now(),
    source,
  };

  return { rate, source };
}

/**
 * Convert GBP amount to satoshis
 * @param gbpAmount Amount in GBP
 * @param btcGbpRate BTC price in GBP
 * @returns Amount in satoshis
 */
export function gbpToSats(gbpAmount: number, btcGbpRate: number): number {
  if (btcGbpRate <= 0) return 0;
  // 1 BTC = 100,000,000 sats
  const btcAmount = gbpAmount / btcGbpRate;
  return Math.round(btcAmount * 100_000_000);
}

/**
 * Convert satoshis to GBP
 * @param sats Amount in satoshis
 * @param btcGbpRate BTC price in GBP
 * @returns Amount in GBP
 */
export function satsToGbp(sats: number, btcGbpRate: number): number {
  if (btcGbpRate <= 0) return 0;
  // 1 BTC = 100,000,000 sats
  const btcAmount = sats / 100_000_000;
  return btcAmount * btcGbpRate;
}

/**
 * Convert any supported currency amount to satoshis
 * @param amount Amount in the given currency
 * @param currency Currency code (sats, btc, gbp, usd)
 * @param btcGbpRate BTC price in GBP (only needed for fiat)
 * @returns Amount in satoshis
 */
export function toSats(
  amount: number,
  currency: string,
  btcGbpRate?: number
): number {
  const curr = currency.toLowerCase();

  switch (curr) {
    case 'sats':
    case 'sat':
      return Math.round(amount);

    case 'btc':
      return Math.round(amount * 100_000_000);

    case 'gbp':
    case '£':
      if (!btcGbpRate) {
        console.warn('BTC/GBP rate not provided for GBP conversion');
        return 0;
      }
      return gbpToSats(amount, btcGbpRate);

    case 'usd':
    case '$':
      // Approximate USD to GBP conversion (1 USD ≈ 0.79 GBP)
      // TODO: Fetch actual USD/GBP rate
      if (!btcGbpRate) {
        console.warn('BTC/GBP rate not provided for USD conversion');
        return 0;
      }
      const gbpEquivalent = amount * 0.79;
      return gbpToSats(gbpEquivalent, btcGbpRate);

    default:
      console.warn(`Unknown currency: ${currency}`);
      return 0;
  }
}
