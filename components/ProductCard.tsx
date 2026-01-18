'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Heart, ShoppingCart, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { useCart } from '@/hooks/useCart';

import { formatPrice, formatRelativeTime, getProductImage } from '@/lib/productUtils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = getProductImage(product.images);
  const inCart = isInCart(product.id);

  return (
    <Card
      className="group border-gini-200 hover-lift relative overflow-hidden bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bow decoration on hover */}
      <div
        className={`absolute -top-1 -right-1 z-10 text-2xl transition-all duration-300 ${
          isHovered ? 'rotate-12 opacity-100' : 'rotate-0 opacity-0'
        }`}
      >
        🎀
      </div>

      {/* Image container */}
      <Link href={`/${product.naddr}`}>
        <div className="bg-gini-50 relative aspect-square overflow-hidden">
          {!imageError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="bg-gini-100 absolute inset-0 flex items-center justify-center">
              <div className="text-foreground/40 text-center">
                <div className="mb-2 text-4xl">🐹</div>
                <span className="font-elegance text-sm">No image</span>
              </div>
            </div>
          )}

          {/* Quick add overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Button
              size="sm"
              className="text-primary hover:bg-gini-50 bg-white shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
            >
              {inCart ? (
                <>
                  <Heart className="mr-1 h-4 w-4 fill-[#ff6b9d] text-[#ff6b9d]" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gini-100 text-primary/80 font-elegance text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/${product.naddr}`}>
          <h3 className="font-elegance text-foreground hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="font-elegance text-foreground/60 mt-1 line-clamp-2 text-sm">
          {product.summary}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        {/* Price */}
        <div className="flex items-center gap-1">
          <span className="text-lg">⚡</span>
          <span className="font-elegance text-primary text-lg font-semibold">
            {formatPrice(product.price.amount, product.price.currency)}
          </span>
        </div>

        {/* Time */}
        <span className="text-foreground/40 font-elegance text-xs">
          {formatRelativeTime(product.publishedAt)}
        </span>
      </CardFooter>
    </Card>
  );
}
