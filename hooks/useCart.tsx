'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { CartItem, CartState, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalSats: number;
  totalPrice: number;
  currency: string;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'gini3d-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setItems(parsed);
        } catch (e) {
          console.error('Failed to parse cart from storage:', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalSats = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price.amount);
    // Convert to sats if needed
    const itemCurrency = item.product.price.currency.toLowerCase();
    if (itemCurrency === 'btc') {
      return sum + price * 100000000 * item.quantity;
    }
    return sum + price * item.quantity;
  }, 0);

  // Calculate total price and currency (assumes all items use same currency)
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price.amount) || 0;
    return sum + price * item.quantity;
  }, 0);

  const currency = items.length > 0 ? items[0].product.price.currency : 'USD';

  const value: CartContextType = {
    items,
    totalItems,
    totalSats,
    totalPrice,
    currency,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
