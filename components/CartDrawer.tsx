'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Heart, Minus, Plus, ShoppingCart, Trash2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCart } from '@/hooks/useCart';

import { formatPrice, getProductImage } from '@/lib/productUtils';

interface CartDrawerProps {
  onClose: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, totalItems, totalSats, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-gini-200 bg-gini-gradient border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-primary h-5 w-5" />
            <h2 className="font-logo text-primary text-xl">Your Cart</h2>
          </div>
          <span className="font-elegance text-foreground/60 text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl">🐹</div>
            <h3 className="font-elegance text-foreground mb-2 text-lg">Your cart is empty</h3>
            <p className="font-elegance text-foreground/60 mb-6 text-sm">
              Add some cute 3D printed goodies!
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-[#db2777]">
              <Heart className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.product.id, qty)}
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total & Checkout */}
      {items.length > 0 && (
        <div className="border-gini-200 bg-gini-50 border-t p-6">
          {/* Total */}
          <div className="mb-4 flex items-center justify-between">
            <span className="font-elegance text-foreground text-lg">Total</span>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-elegance text-primary text-xl font-semibold">
                {totalSats.toLocaleString()} sats
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="bg-primary font-elegance shadow-gini h-12 w-full text-lg text-white hover:bg-[#db2777]"
            onClick={() => {
              // TODO: Implement checkout with Gamma Markets
              alert('Checkout coming soon! ⚡');
            }}
          >
            <Zap className="mr-2 h-5 w-5" />
            Pay with Lightning
          </Button>

          {/* Clear Cart */}
          <Button
            variant="ghost"
            className="text-foreground/60 hover:text-destructive mt-2 w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
}

interface CartItemProps {
  item: {
    product: {
      id: string;
      title: string;
      images: string[];
      price: {
        amount: string;
        currency: string;
      };
      naddr: string;
    };
    quantity: number;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getProductImage(item.product.images);

  return (
    <div className="border-gini-200 flex gap-4 rounded-lg border bg-white p-3 shadow-sm">
      {/* Image */}
      <Link href={`/${item.product.naddr}`} className="shrink-0">
        <div className="bg-gini-50 relative h-20 w-20 overflow-hidden rounded-md">
          {!imageError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.product.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🐹</span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <Link href={`/${item.product.naddr}`}>
          <h4 className="font-elegance text-foreground hover:text-primary line-clamp-2 font-medium transition-colors">
            {item.product.title}
          </h4>
        </Link>

        <p className="font-elegance text-primary mt-1 text-sm">
          {formatPrice(item.product.price.amount, item.product.price.currency)}
        </p>

        {/* Quantity Controls */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gini-200 h-7 w-7"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="font-elegance w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="border-gini-200 h-7 w-7"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground/40 hover:text-destructive h-8 w-8 shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
