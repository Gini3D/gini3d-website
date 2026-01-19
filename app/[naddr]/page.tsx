'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  ChevronLeft,
  Heart,
  Loader2,
  MessageCircle,
  Share2,
  ShoppingCart,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';

import { shortenPubkey } from '@/lib/nostr';
import { formatPrice, formatRelativeTime } from '@/lib/productUtils';

export default function ProductPage() {
  const params = useParams();
  const naddr = params.naddr as string;
  const { product, loading, error } = useProduct(naddr);
  const { addItem, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🐹</span>
          </div>
        </div>
        <p className="font-elegance text-foreground/60 mt-4 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 text-5xl">😢</div>
        <h1 className="font-elegance text-foreground mb-2 text-2xl">Product Not Found</h1>
        <p className="font-elegance text-foreground/60 mb-6">
          {error || "We couldn't find this product. It may have been removed."}
        </p>
        <Button asChild className="bg-primary hover:bg-[#db2777]">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ['/images/placeholder-product.png'];
  const currentImage = images[selectedImage] || images[0];
  const inCart = isInCart(product.id);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/"
          className="text-primary font-elegance mb-6 inline-flex items-center gap-1 transition-colors hover:text-[#db2777]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gini-50 shadow-gini relative aspect-square overflow-hidden rounded-2xl">
              {!imageError ? (
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="bg-gini-100 absolute inset-0 flex items-center justify-center">
                  <div className="text-foreground/40 text-center">
                    <div className="mb-2 text-6xl">🐹</div>
                    <span className="font-elegance">No image available</span>
                  </div>
                </div>
              )}

              {/* Bow decoration */}
              <div className="absolute -top-2 -right-2 rotate-12 text-4xl">🎀</div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageError(false);
                    }}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary shadow-gini'
                        : 'hover:border-gini-200 border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gini-100 text-primary/80 font-elegance"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-elegance text-foreground text-3xl font-semibold md:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="bg-gini-50 border-gini-200 flex items-center gap-3 rounded-xl border p-4">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-elegance text-foreground/60 text-sm">Price</p>
                <p className="font-elegance text-primary text-2xl font-semibold">
                  {formatPrice(product.price.amount, product.price.currency)}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-gini-200 flex items-center gap-3 rounded-xl border bg-white p-4">
              {product.seller?.picture ? (
                <Image
                  src={product.seller.picture}
                  alt={product.seller.displayName || product.seller.name || 'Seller'}
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="bg-gini-gradient flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-2xl">🐹</span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-elegance text-foreground/60 text-sm">Seller</p>
                <p className="font-elegance text-foreground font-medium">
                  {product.seller?.displayName || product.seller?.name || shortenPubkey(product.pubkey)}
                </p>
                {product.seller?.nip05 && (
                  <p className="font-elegance text-foreground/50 text-xs">{product.seller.nip05}</p>
                )}
              </div>
              <Button variant="outline" size="sm" className="border-gini-200 text-foreground/70">
                <MessageCircle className="mr-1 h-4 w-4" />
                Message
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary font-elegance shadow-gini h-14 flex-1 text-lg text-white hover:bg-[#db2777]"
                onClick={() => addItem(product)}
              >
                {inCart ? (
                  <>
                    <Heart className="mr-2 h-5 w-5 fill-white" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-gini-200 text-foreground/70 hover:bg-gini-50 h-14"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied!');
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-elegance text-foreground text-xl font-semibold">Description</h2>
              <p className="font-elegance text-foreground/70 whitespace-pre-wrap">
                {product.content || product.summary}
              </p>
            </div>

            {/* Location & Time */}
            <div className="text-foreground/60 font-elegance flex flex-wrap gap-4 text-sm">
              {product.location && <span>📍 {product.location}</span>}
              <span>🕐 Listed {formatRelativeTime(product.publishedAt)}</span>
            </div>

            {/* Nostr Link */}
            <div className="border-gini-200 border-t pt-4">
              <p className="font-elegance text-foreground/40 text-sm">
                This product is listed on Nostr using NIP-99.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
