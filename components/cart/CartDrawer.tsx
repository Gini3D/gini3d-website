'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { Minus, Package, Plus, RefreshCw, ShoppingBag, Store, Trash2, Zap } from 'lucide-react';

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

import { type SellerOrder, calculateGrandTotal, groupCartBySeller } from '@/lib/productUtils';
import { SELLER_METADATA } from '@/lib/types';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, totalItems, clearCart, removeItem, updateQuantity } = useCart();
  const { rates, loading: ratesLoading, convertToSats, refresh: refreshRates } = useExchangeRates();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Group cart items by seller and calculate totals
  const { sellerOrders, grandTotal } = useMemo(() => {
    const orders = groupCartBySeller(items, convertToSats, SELLER_METADATA);
    const total = calculateGrandTotal(orders);
    return { sellerOrders: orders, grandTotal: total };
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
                <div className="space-y-6 p-4">
                  {/* Items grouped by seller */}
                  {sellerOrders.map((order) => (
                    <SellerSection
                      key={order.sellerPubkey}
                      order={order}
                      formatPrice={formatPrice}
                      formatSats={formatSats}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}

                  {/* Multi-seller notice */}
                  {sellerOrders.length > 1 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                      <p className="text-amber-800">
                        <strong>Note:</strong> Your order contains items from {sellerOrders.length}{' '}
                        different sellers. Each seller will ship separately and you&apos;ll pay each
                        seller individually.
                      </p>
                    </div>
                  )}
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

                {/* Subtotal */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-fun text-lg font-medium">Subtotal:</span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-gini-600 font-fun text-xl font-bold">
                      {formatSats(grandTotal.subtotalSats)}
                    </span>
                  </div>
                </div>

                {/* Shipping notice */}
                <p className="text-muted-foreground mb-3 text-xs">
                  + Shipping calculated at checkout
                </p>

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
                  Checkout ({sellerOrders.length} {sellerOrders.length === 1 ? 'order' : 'orders'})
                </Button>

                <p className="text-muted-foreground mt-3 text-center text-xs">
                  Pay each seller with Bitcoin Lightning ⚡
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

// Seller section component
interface SellerSectionProps {
  order: SellerOrder;
  formatPrice: (amount: string | number, currency: string) => string;
  formatSats: (sats: number) => string;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}

function SellerSection({
  order,
  formatPrice,
  formatSats,
  updateQuantity,
  removeItem,
}: SellerSectionProps) {
  return (
    <div className="border-gini-200 overflow-hidden rounded-lg border">
      {/* Seller Header */}
      <div className="bg-gini-50 border-gini-200 flex items-center gap-2 border-b px-3 py-2">
        {order.sellerPicture ? (
          <Image
            src={order.sellerPicture}
            alt={order.sellerName}
            width={24}
            height={24}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <Store className="text-gini-500 h-5 w-5" />
        )}
        <span className="font-fun text-sm font-medium">{order.sellerName}</span>
      </div>

      {/* Items */}
      <div className="divide-gini-100 divide-y">
        {order.items.map((item) => (
          <div key={item.product.id} className="flex gap-3 bg-white p-3">
            {/* Product Image */}
            <div className="bg-gini-100 relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">🎁</div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex min-w-0 flex-1 flex-col">
              <h4 className="font-fun truncate text-sm leading-tight font-medium">
                {item.product.title}
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-gini-600 text-sm font-medium">
                  {formatPrice(item.product.price.amount, item.product.price.currency)}
                </span>
                {item.product.price.currency.toLowerCase() !== 'sats' &&
                  item.product.price.currency.toLowerCase() !== 'sat' && (
                    <span className="text-muted-foreground text-xs">
                      ≈ {formatSats(item.satsAmount)}
                    </span>
                  )}
              </div>

              {/* Quantity Controls */}
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seller Subtotal */}
      <div className="bg-gini-50 border-gini-200 border-t px-3 py-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Subtotal</span>
          <span className="text-gini-600">{formatSats(order.subtotalSats)}</span>
        </div>
      </div>
    </div>
  );
}
