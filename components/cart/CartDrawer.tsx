'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

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

import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, totalItems, totalPrice, currency, clearCart, removeItem, updateQuantity } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
    // Delay opening checkout to allow sheet close animation to complete
    setTimeout(() => {
      setCheckoutOpen(true);
    }, 350);
  };

  const formatPrice = (amount: string | number, curr: string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (curr.toLowerCase() === 'sats' || curr.toLowerCase() === 'sat') {
      return `${num.toLocaleString()} sats`;
    }
    return `$${num.toFixed(2)}`;
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
                        <h4 className="font-fun text-sm font-medium leading-tight">
                          {item.product.title}
                        </h4>
                        <p className="text-gini-600 mt-1 text-sm font-medium">
                          {formatPrice(item.product.price.amount, item.product.price.currency)}
                        </p>

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

                <div className="mb-4 flex items-center justify-between">
                  <span className="font-fun text-lg font-medium">Total:</span>
                  <span className="text-gini-600 font-fun text-xl font-bold">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Checkout
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
