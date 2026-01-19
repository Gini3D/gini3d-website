'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { fetchExchangeRates, convertToSats as convertToSatsUtil } from '@/lib/exchangeRates';

interface ExchangeRates {
  BTCGBP: number;
  BTCUSD: number;
  BTCEUR: number;
  updatedAt: number;
}

interface ExchangeRatesContextType {
  rates: ExchangeRates | null;
  loading: boolean;
  error: string | null;
  convertToSats: (amount: number, currency: string) => number;
  refresh: () => Promise<void>;
}

const ExchangeRatesContext = createContext<ExchangeRatesContextType | null>(null);

// Default fallback rates (approximate values)
const FALLBACK_RATES: ExchangeRates = {
  BTCGBP: 80000,
  BTCUSD: 100000,
  BTCEUR: 90000,
  updatedAt: 0,
};

export function ExchangeRatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const newRates = await fetchExchangeRates();
      setRates(newRates);
    } catch (e) {
      console.error('Failed to fetch exchange rates:', e);
      setError('Failed to fetch exchange rates');
      // Use fallback rates on error
      if (!rates) {
        setRates(FALLBACK_RATES);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch rates on mount and every 5 minutes
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertToSats = (amount: number, currency: string): number => {
    const activeRates = rates || FALLBACK_RATES;
    return convertToSatsUtil(amount, currency, activeRates);
  };

  return (
    <ExchangeRatesContext.Provider
      value={{
        rates,
        loading,
        error,
        convertToSats,
        refresh,
      }}
    >
      {children}
    </ExchangeRatesContext.Provider>
  );
}

export function useExchangeRates() {
  const context = useContext(ExchangeRatesContext);
  if (!context) {
    throw new Error('useExchangeRates must be used within an ExchangeRatesProvider');
  }
  return context;
}
