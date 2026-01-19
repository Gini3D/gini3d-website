'use client';

import { Loader2 } from 'lucide-react';

import type { Product } from '@/lib/types';

import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🐹</span>
          </div>
        </div>
        <p className="font-elegance text-foreground/60 mt-4 text-lg">
          Loading adorable products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 text-5xl">😢</div>
        <h3 className="font-elegance text-foreground mb-2 text-xl">Oops! Something went wrong</h3>
        <p className="font-elegance text-foreground/60 max-w-md text-center">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 text-5xl">🐹</div>
        <h3 className="font-elegance text-foreground mb-2 text-xl">No products found</h3>
        <p className="font-elegance text-foreground/60 max-w-md text-center">
          We&apos;re working on adding more cute 3D printed goodies!
          <br />
          Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
