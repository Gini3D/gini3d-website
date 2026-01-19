'use client';

import Link from 'next/link';

import { Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-gini-gradient relative overflow-hidden py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 animate-bounce text-4xl opacity-30">🎀</div>
      <div className="absolute top-8 right-8 animate-pulse text-3xl opacity-30">💖</div>
      <div className="absolute bottom-8 left-12 animate-bounce text-2xl opacity-30 delay-150">
        🐹
      </div>
      <div className="absolute right-16 bottom-4 animate-pulse text-3xl opacity-30 delay-300">
        ✨
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-primary mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-elegance">Welcome to our 3D Print Shop!</span>
            </div>

            <h1 className="font-logo text-primary mb-4 text-4xl md:text-5xl lg:text-6xl">Gini3D</h1>

            <p className="font-elegance text-foreground/80 mb-2 max-w-xl text-xl md:text-2xl">
              Adorable 3D Printed Creations
            </p>

            <p className="font-elegance text-foreground/60 mb-8 max-w-lg text-lg">
              Run by Nini (10) and Gabby (10) - two guinea pig loving friends who create cute and
              unique 3D printed products just for you!
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary font-elegance shadow-gini px-8 text-lg text-white hover:bg-[#db2777]"
              >
                <Link href="#products">
                  <Heart className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-gini-100 font-elegance px-8 text-lg"
              >
                <Link href="/about">Meet Nini & Gabby</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration Area */}
          <div className="flex flex-1 justify-center">
            <div className="relative">
              {/* Decorative frame */}
              <div className="border-gini-200 absolute inset-0 -m-4 rotate-3 rounded-3xl border-4"></div>
              <div className="border-gini-300 absolute inset-0 -m-4 -rotate-3 rounded-3xl border-4"></div>

              {/* Main image container */}
              <div className="shadow-gini relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl bg-white md:h-80 md:w-80">
                {/* Placeholder for Nini & Gabby image */}
                <div className="p-6 text-center">
                  <div className="mb-4 text-6xl">🐹🐹</div>
                  <p className="font-elegance text-foreground/60 text-sm">
                    Nini &amp; Gabby&apos;s
                    <br />
                    3D Print Shop
                  </p>
                </div>

                {/* Bow decoration */}
                <div className="absolute -top-2 -right-2 rotate-12 transform text-3xl">🎀</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
