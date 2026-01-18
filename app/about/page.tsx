'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Heart, ShoppingCart, Sparkles, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="bg-gini-100 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-elegance">Our Story</span>
          </div>

          <h1 className="font-logo text-primary mb-4 text-4xl md:text-5xl">Meet Nini & Gabby</h1>

          <p className="font-elegance text-foreground/70 mx-auto max-w-2xl text-xl">
            Two 10-year-old best friends on a mission to spread cuteness through 3D printed
            creations!
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="border-gini-200 absolute inset-0 -m-4 rotate-2 rounded-3xl border-4"></div>
            <div className="border-gini-300 absolute inset-0 -m-4 -rotate-2 rounded-3xl border-4"></div>
            <div className="bg-gini-gradient relative rounded-2xl p-8 text-center">
              <div className="mb-4 text-8xl">🐹🐹</div>
              <p className="font-elegance text-foreground/60">
                Nini & Gabby with their guinea pig mascots!
              </p>
              <div className="absolute -top-2 -right-2 rotate-12 text-3xl">🎀</div>
              <div className="absolute -bottom-2 -left-2 -rotate-12 text-2xl">💖</div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-elegance text-foreground text-3xl font-semibold">
              <span className="heart-decoration">How It Started</span>
            </h2>
            <p className="font-elegance text-foreground/70 text-lg">
              Hi! We're Nini and Gabby, and we're both 10 years old. We've been best friends since
              kindergarten and we LOVE guinea pigs! The name <strong className="text-gini-heart">Gini3D</strong> comes
              from our names: <strong>G</strong>abby + N<strong>ini</strong> = <strong>Gini</strong>!
              Plus we love guinea pigs, so it works perfectly! 🐹
            </p>
            <p className="font-elegance text-foreground/70 text-lg">
              We started making 3D printed keychains and figurines for our friends, and everyone
              loved them so much that we decided to start our own little shop! Our dads helped us
              set everything up on Nostr so people can buy our creations with Bitcoin Lightning. ⚡
            </p>
            <p className="font-elegance text-foreground/70 text-lg">
              We also feature products from pre-selected sellers who specialize in 3D printing on
              Nostr, like Robotechy (run by Isaac, who's 15!).
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-gini-gradient mb-16 rounded-3xl p-8 md:p-12">
          <h2 className="font-elegance text-foreground mb-8 text-center text-3xl font-semibold">
            <span className="heart-decoration">What Makes Us Special</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="hover-lift rounded-2xl bg-white p-6 text-center">
              <div className="mb-4 text-4xl">🎨</div>
              <h3 className="font-elegance text-foreground mb-2 text-xl font-semibold">
                Cute Designs
              </h3>
              <p className="font-elegance text-foreground/60">
                We design everything ourselves! Lots of guinea pigs, hearts, and pastel colors.
              </p>
            </div>

            <div className="hover-lift rounded-2xl bg-white p-6 text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="font-elegance text-foreground mb-2 text-xl font-semibold">
                Bitcoin Lightning
              </h3>
              <p className="font-elegance text-foreground/60">
                Pay instantly with super low fees! Our dads taught us about Bitcoin and we think
                it's really cool.
              </p>
            </div>

            <div className="hover-lift rounded-2xl bg-white p-6 text-center">
              <div className="mb-4 text-4xl">💜</div>
              <h3 className="font-elegance text-foreground mb-2 text-xl font-semibold">
                Made With Love
              </h3>
              <p className="font-elegance text-foreground/60">
                Every item is printed and packaged by us with extra care (and sometimes guinea pig
                stickers!).
              </p>
            </div>
          </div>
        </div>

        {/* Featured Sellers Section */}
        <div className="mb-16">
          <h2 className="font-elegance text-foreground mb-8 text-center text-3xl font-semibold">
            <span className="heart-decoration">Featured Sellers</span>
          </h2>

          <p className="font-elegance text-foreground/70 mx-auto mb-8 max-w-2xl text-center text-lg">
            We feature pre-selected sellers who specialize in 3D printing on Nostr!
          </p>

          <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
            <div className="border-gini-200 hover-lift rounded-2xl border bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-gini-gradient flex h-16 w-16 items-center justify-center rounded-full text-3xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-elegance text-foreground text-xl font-semibold">Robotechy</h3>
                  <p className="font-elegance text-foreground/60 text-sm">Run by Isaac, 15</p>
                </div>
              </div>
              <p className="font-elegance text-foreground/70">
                Amazing 3D printed Bitcoin keychains, Lightning Piggy banks, and more! Isaac was one
                of the first to sell on Nostr.
              </p>
            </div>

            <div className="border-gini-200 hover-lift rounded-2xl border bg-white p-6 opacity-60">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-gini-gradient flex h-16 w-16 items-center justify-center rounded-full text-3xl">
                  ❓
                </div>
                <div>
                  <h3 className="font-elegance text-foreground text-xl font-semibold">
                    More Coming Soon!
                  </h3>
                  <p className="font-elegance text-foreground/60 text-sm">Want to be featured?</p>
                </div>
              </div>
              <p className="font-elegance text-foreground/70">
                Are you a young maker selling on Nostr? Message us and maybe we can feature your
                products too!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gini-gradient inline-block rounded-3xl p-8">
            <div className="mb-4 text-5xl">🐹💖🐹</div>
            <h2 className="font-elegance text-foreground mb-4 text-2xl font-semibold">
              Ready to Shop?
            </h2>
            <p className="font-elegance text-foreground/70 mb-6">
              Check out our adorable 3D printed creations!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary font-elegance shadow-gini text-white hover:bg-[#db2777]"
            >
              <Link href="/#products">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
