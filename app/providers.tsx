'use client';

import { ReactNode } from 'react';

import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import { ExchangeRatesProvider } from '@/hooks/useExchangeRates';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ExchangeRatesProvider>
        <CartProvider>{children}</CartProvider>
      </ExchangeRatesProvider>
    </AuthProvider>
  );
}
