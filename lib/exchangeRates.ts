// Exchange rate service for converting fiat currencies to Bitcoin/sats
// Uses Kraken and Coinbase public APIs (no API keys required)

interface ExchangeRates {
  BTCGBP: number; // 1 BTC = X GBP
  BTCUSD: number; // 1 BTC = X USD
  BTCEUR: number; // 1 BTC = X EUR
  updatedAt: number;
}

interface KrakenTickerResponse {
  error: string[];
  result: {
    [key: string]: {
      c: [string, string]; // Close price [price, lot volume]
    };
  };
}

interface CoinbaseSpotResponse {
  data: {
    base: string;
    currency: string;
    amount: string;
  };
}

// Cache exchange rates for 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000;
let cachedRates: ExchangeRates | null = null;

// Kraken API URL from env
const KRAKEN_GBP_URL =
  process.env.NEXT_PUBLIC_EXCHANGE_KRAKEN_URL ||
  'https://api.kraken.com/0/public/Ticker?pair=XBTGBP';

// Coinbase API URLs from env
const COINBASE_GBP_URL =
  process.env.NEXT_PUBLIC_EXCHANGE_COINBASE_URL ||
  'https://api.coinbase.com/v2/prices/BTC-GBP/spot';
const COINBASE_USD_URL = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';
const COINBASE_EUR_URL = 'https://api.coinbase.com/v2/prices/BTC-EUR/spot';

/**
 * Fetch BTC/GBP rate from Kraken
 */
async function fetchKrakenRate(): Promise<number | null> {
  try {
    const response = await fetch(KRAKEN_GBP_URL);
    if (!response.ok) return null;

    const data: KrakenTickerResponse = await response.json();
    if (data.error && data.error.length > 0) return null;

    // Kraken uses XXBTZGBP as the pair name
    const pair = Object.keys(data.result)[0];
    if (pair && data.result[pair]) {
      return parseFloat(data.result[pair].c[0]);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch Kraken rate:', error);
    return null;
  }
}

/**
 * Fetch spot price from Coinbase
 */
async function fetchCoinbaseRate(url: string): Promise<number | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: CoinbaseSpotResponse = await response.json();
    return parseFloat(data.data.amount);
  } catch (error) {
    console.error('Failed to fetch Coinbase rate:', error);
    return null;
  }
}

/**
 * Fetch all exchange rates from multiple sources
 * Tries Kraken first for GBP, falls back to Coinbase
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Return cached rates if still valid
  if (cachedRates && Date.now() - cachedRates.updatedAt < CACHE_DURATION_MS) {
    return cachedRates;
  }

  // Fetch rates in parallel
  const [krakenGBP, coinbaseGBP, coinbaseUSD, coinbaseEUR] = await Promise.all([
    fetchKrakenRate(),
    fetchCoinbaseRate(COINBASE_GBP_URL),
    fetchCoinbaseRate(COINBASE_USD_URL),
    fetchCoinbaseRate(COINBASE_EUR_URL),
  ]);

  // Use Kraken for GBP if available, otherwise Coinbase
  const btcGbp = krakenGBP || coinbaseGBP || 80000; // Fallback ~£80k

  cachedRates = {
    BTCGBP: btcGbp,
    BTCUSD: coinbaseUSD || 100000, // Fallback ~$100k
    BTCEUR: coinbaseEUR || 90000, // Fallback ~€90k
    updatedAt: Date.now(),
  };

  return cachedRates;
}

/**
 * Convert a fiat amount to satoshis
 * @param amount - The amount in fiat currency
 * @param currency - The currency code (GBP, USD, EUR, SATS, BTC)
 * @param rates - Current exchange rates
 */
export function convertToSats(amount: number, currency: string, rates: ExchangeRates): number {
  const currencyUpper = currency.toUpperCase();

  // Already in sats
  if (currencyUpper === 'SATS' || currencyUpper === 'SAT') {
    return Math.round(amount);
  }

  // Already in BTC - convert to sats
  if (currencyUpper === 'BTC') {
    return Math.round(amount * 100_000_000);
  }

  // Convert fiat to BTC then to sats
  let btcAmount: number;
  switch (currencyUpper) {
    case 'GBP':
    case '£':
      btcAmount = amount / rates.BTCGBP;
      break;
    case 'USD':
    case '$':
      btcAmount = amount / rates.BTCUSD;
      break;
    case 'EUR':
    case '€':
      btcAmount = amount / rates.BTCEUR;
      break;
    default:
      // Default to USD if unknown currency
      console.warn(`Unknown currency: ${currency}, defaulting to USD`);
      btcAmount = amount / rates.BTCUSD;
  }

  return Math.round(btcAmount * 100_000_000);
}

/**
 * Format satoshis for display
 */
export function formatSats(sats: number): string {
  return sats.toLocaleString();
}

/**
 * Get a human-readable exchange rate string
 */
export function getExchangeRateDisplay(currency: string, rates: ExchangeRates): string {
  const currencyUpper = currency.toUpperCase();
  switch (currencyUpper) {
    case 'GBP':
    case '£':
      return `1 BTC = £${rates.BTCGBP.toLocaleString()}`;
    case 'USD':
    case '$':
      return `1 BTC = $${rates.BTCUSD.toLocaleString()}`;
    case 'EUR':
    case '€':
      return `1 BTC = €${rates.BTCEUR.toLocaleString()}`;
    default:
      return '';
  }
}
