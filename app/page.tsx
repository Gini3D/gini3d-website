'use client';

import { useMemo, useState } from 'react';

import { Filter, Heart, Search } from 'lucide-react';

import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useProducts } from '@/hooks/useProducts';

import { filterProductsBySearch } from '@/lib/productUtils';
import { FEATURED_SELLERS } from '@/lib/types';

export default function Home() {
  // Only show products from whitelisted sellers
  const { products, loading, error } = useProducts({ sellers: FEATURED_SELLERS });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return filterProductsBySearch(products, searchTerm);
  }, [products, searchTerm]);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8 text-center">
            <h2 className="font-elegance text-foreground mb-2 text-3xl font-semibold md:text-4xl">
              <span className="heart-decoration">Our Products</span>
            </h2>
            <p className="font-elegance text-foreground/60 mx-auto max-w-lg">
              Browse our collection of adorable 3D printed creations and products from featured
              sellers on Nostr
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-foreground/40 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search products..."
                className="border-gini-200 focus:border-primary font-elegance pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="border-gini-200 text-foreground/70 hover:bg-gini-50 font-elegance"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} loading={loading} error={error} />

          {/* More Products Link */}
          {filteredProducts.length > 0 && !loading && (
            <div className="mt-12 text-center">
              <p className="font-elegance text-foreground/60 mb-4">More products coming soon!</p>
              <div className="flex justify-center gap-2 text-2xl">
                <span className="animate-pulse">💖</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
                  🐹
                </span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
                  💖
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories (placeholder for future) */}
      <section className="bg-gini-gradient py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-elegance text-foreground mb-8 text-center text-2xl font-semibold md:text-3xl">
            <span className="heart-decoration">Popular Categories</span>
          </h2>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'Keychains', emoji: '🔑', color: 'bg-pink-100' },
              { name: 'Figurines', emoji: '🎨', color: 'bg-purple-100' },
              { name: 'Phone Cases', emoji: '📱', color: 'bg-blue-100' },
              { name: 'Home Decor', emoji: '🏠', color: 'bg-green-100' },
            ].map((category) => (
              <button
                key={category.name}
                className={`${category.color} hover-lift cursor-pointer rounded-xl border border-white/50 p-6 text-center`}
              >
                <div className="mb-2 text-3xl">{category.emoji}</div>
                <span className="font-elegance text-foreground/80">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-5xl">🐹🐹</div>
            <h2 className="font-elegance text-foreground mb-4 text-2xl font-semibold md:text-3xl">
              Meet Nini & Gabby
            </h2>
            <p className="font-elegance text-foreground/70 mb-6">
              We&apos;re two 10-year-old best friends who love guinea pigs and creating cute things!
              We started Gini3D to share our 3D printed creations with the world.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-gini-50 font-elegance cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4" />
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
