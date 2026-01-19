'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { Minus, Plus, RefreshCw, ShoppingBag, Trash2, Zap } from 'lucide-react';

import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { useCart } from '@/hooks/useCart';
import { useExchangeRates } from '@/hooks/useExchangeRates';

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    totalItems,
    clearCart,
    removeItem,
    updateQuantity,
  } = useCart();
  const { rates, loading: ratesLoading, convertToSats, refresh: refreshRates } = useExchangeRates();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Calculate total in sats using exchange rates
  const { totalSats, itemSats } = useMemo(() => {
    const itemSatsMap = new Map<string, number>();
    let total = 0;

    for (const item of items) {
      const amount = parseFloat(item.product.price.amount) || 0;
      const currency = item.product.price.currency;
      const sats = convertToSats(amount, currency) * item.quantity;
      itemSatsMap.set(item.product.id, sats / item.quantity); // Store per-item sats
      total += sats;
    }

    return { totalSats: total, itemSats: itemSatsMap };
  }, [items, convertToSats]);

  const handleCheckout = () => {
    setIsOpen(false);
    // Delay opening checkout to allow sheet close animation to complete
    setTimeout(() => {
      setCheckoutOpen(true);
    }, 350);
  };

  const formatPrice = (amount: string | number, curr: string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const currLower = curr.toLowerCase();
    if (currLower === 'sats' || currLower === 'sat') {
      return `${num.toLocaleString()} sats`;
    }
    if (currLower === 'gbp' || curr === '£') {
      return `£${num.toFixed(2)}`;
    }
    if (currLower === 'eur' || curr === '€') {
      return `€${num.toFixed(2)}`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatSats = (sats: number) => {
    return `${Math.round(sats).toLocaleString()} sats`;
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="font-fun flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-pink-500" />
              Shopping Cart
              {totalItems > 0 && (
                <span className="bg-gini-100 text-gini-600 rounded-full px-2 py-0.5 text-sm">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </SheetTitle>
            <SheetDescription className="sr-only">Your shopping cart items</SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 text-6xl">🛒</div>
              <h3 className="font-fun mb-2 text-lg font-medium">Your cart is empty!</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Add some adorable 3D prints to get started 💖
              </p>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-gini-300 hover:bg-gini-100 font-fun"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="border-gini-200 flex gap-4 rounded-lg border bg-white p-3"
                    >
                      {/* Product Image */}
                      <div className="bg-gini-100 relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🎁
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col">
                        <h4 className="font-fun text-sm leading-tight font-medium">
                          {item.product.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-gini-600 text-sm font-medium">
                            {formatPrice(item.product.price.amount, item.product.price.currency)}
                          </span>
                          {item.product.price.currency.toLowerCase() !== 'sats' &&
                            item.product.price.currency.toLowerCase() !== 'sat' && (
                              <span className="text-muted-foreground text-xs">
                                ≈ {formatSats(itemSats.get(item.product.id) || 0)}
                              </span>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Cart Summary */}
              <div className="border-t p-4">
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Clear Cart
                  </Button>
                )}

                {/* Total in Sats */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-fun text-lg font-medium">Total:</span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-gini-600 font-fun text-xl font-bold">
                      {formatSats(totalSats)}
                    </span>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                {rates && (
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      Rate: 1 BTC = £{rates.BTCGBP.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      onClick={refreshRates}
                      disabled={ratesLoading}
                    >
                      <RefreshCw className={`mr-1 h-3 w-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                      {ratesLoading ? 'Updating...' : 'Refresh'}
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
                  size="lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Pay {formatSats(totalSats)}
                </Button>

                <p className="text-muted-foreground mt-3 text-center text-xs">
                  Pay with Bitcoin Lightning ⚡
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
