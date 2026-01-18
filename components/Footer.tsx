'use client';

import Link from 'next/link';

import { Github, Heart, Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gini-gradient border-gini-200 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🐹</span>
              <span className="font-logo text-primary text-xl">Gini3D</span>
            </div>
            <p className="font-elegance text-foreground/70 mb-4">
              A cute 3D print marketplace run by Nini (10) and Gabby (10) - two best friends who
              love guinea pigs and making adorable things!
            </p>
            <div className="text-foreground/60 flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4 text-[#ff6b9d]" />
              <span className="font-elegance">Made with love in 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-elegance text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              <span className="text-[#ff6b9d]">🎀</span>
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="font-elegance text-foreground/70 hover:text-primary transition-colors"
              >
                Shop All Products
              </Link>
              <Link
                href="/about"
                className="font-elegance text-foreground/70 hover:text-primary transition-colors"
              >
                About Nini & Gabby
              </Link>
              <Link
                href="/sellers"
                className="font-elegance text-foreground/70 hover:text-primary transition-colors"
              >
                Featured Sellers
              </Link>
            </nav>
          </div>

          {/* Payment & Nostr */}
          <div>
            <h3 className="font-elegance text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-4 w-4 text-yellow-500" />
              Payments
            </h3>
            <p className="font-elegance text-foreground/70 mb-4">
              We accept Bitcoin Lightning payments! Fast, cheap, and fun!
            </p>
            <div className="border-gini-200 flex items-center gap-2 rounded-lg border bg-white/60 p-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-elegance text-foreground text-sm font-semibold">
                  Lightning Network
                </p>
                <p className="font-elegance text-foreground/60 text-xs">Instant & Low Fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-gini-200 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="font-elegance text-foreground/60 text-sm">
            © {currentYear} Gini3D. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="font-elegance text-foreground/60 text-sm">
              Powered by Nostr & Bitcoin
            </span>
            <span className="text-lg">💜</span>
          </div>
        </div>

        {/* Decorative Guinea Pigs */}
        <div className="mt-8 flex justify-center gap-4 text-3xl opacity-50">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>
            🐹
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
            💖
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            🐹
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>
            🎀
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
            🐹
          </span>
        </div>
      </div>
    </footer>
  );
}
