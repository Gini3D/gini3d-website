'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink, Star, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { fetchEvents, pubkeyToNpub } from '@/lib/nostr';
import { DEFAULT_RELAYS, FEATURED_SELLERS, SellerProfile } from '@/lib/types';

interface FeaturedSeller {
  pubkey: string;
  name: string;
  description: string;
  specialty: string;
  picture?: string;
  npub: string;
  productCount?: number;
}

// Hardcoded featured sellers for display
const FEATURED_SELLER_DATA: FeaturedSeller[] = [
  {
    pubkey: 'd887f1a249412f06d7c043d70aca17d326ba0d26ddfa1793d7bab5a141737412',
    name: 'Gini3D',
    description:
      'Run by Nini (10) and Gabby (10) - two best friends who love guinea pigs and 3D printing! We make cute stuff that makes you smile! 🐹',
    specialty: 'Cute & Colorful Prints',
    npub: 'npub1mzrlrgjfgyhsd47qg0ts4jsh6vnt5rfxmhap0y7hh266zstnwsfqj2nr3d',
  },
  {
    pubkey: '211f325b5396968ac0c79b7c0a030d768206d32ac61f93f143de112b859bd46f',
    name: 'Robotechy',
    description:
      'Isaac Weeks (15) sells Bitcoin-themed 3D prints including Lightning Piggy banks, Bitcoin keyfobs, and Seed Signer cases.',
    specialty: 'Bitcoin Hardware & 3D Prints',
    npub: 'npub1yy0nyk6nj6tg4sx8nd7q5qcdw6pqd5e2cc0e8u2rmcgjhpvm63hsk67xe5',
  },
  {
    pubkey: 'e67b0de75a95236e7cadd7097d50c6c76aca8aaa8780a109869750e415b45a75',
    name: 'Plebeian Market',
    description:
      'A decentralized marketplace built on Nostr. Buy and sell products using Bitcoin Lightning payments.',
    specialty: 'Nostr Marketplace',
    npub: 'npub1ueasme66j53kul9d6uyh65xxca4v4z42s7q2zzvxjagwg9d5tf6sdzlv25',
  },
];

export default function SellersPage() {
  const [sellers] = useState<FeaturedSeller[]>(FEATURED_SELLER_DATA);
  const [profiles, setProfiles] = useState<Map<string, SellerProfile>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        // Fetch profiles for featured sellers
        const profileEvents = await fetchEvents(
          {
            kinds: [0],
            authors: FEATURED_SELLERS,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          DEFAULT_RELAYS
        );

        const profileMap = new Map<string, SellerProfile>();
        for (const event of profileEvents) {
          try {
            const profile = JSON.parse(event.content);
            profileMap.set(event.pubkey, {
              pubkey: event.pubkey,
              name: profile.name,
              displayName: profile.display_name || profile.displayName,
              picture: profile.picture,
              about: profile.about,
              nip05: profile.nip05,
              npub: pubkeyToNpub(event.pubkey),
            });
          } catch {
            // Skip invalid profiles
          }
        }
        setProfiles(profileMap);
      } catch (error) {
        console.error('Failed to load seller profiles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Fun Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Star className="h-6 w-6 animate-pulse text-yellow-400" />
          <span className="text-4xl">🌟</span>
          <Star className="h-6 w-6 animate-pulse text-yellow-400" />
        </div>
        <h1 className="font-fun gradient-text mb-4 text-4xl font-bold md:text-5xl">
          Amazing Sellers!
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          We feature pre-selected sellers who specialize in 3D printing on Nostr. Each seller brings
          their own unique style and creativity! 🎨
        </p>
      </div>

      {/* Sellers Grid */}
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {sellers.map((seller, index) => {
          const profile = profiles.get(seller.pubkey);
          const displayName = profile?.displayName || profile?.name || seller.name;
          const picture = profile?.picture || seller.picture;
          const about = profile?.about || seller.description;

          return (
            <Card key={seller.pubkey} className="card-cute hover-lift overflow-hidden">
              <CardHeader className="bg-gini-gradient pb-4">
                <div className="flex items-start gap-4">
                  {/* Seller Avatar */}
                  <div className="relative">
                    {picture ? (
                      <Image
                        src={picture}
                        alt={displayName}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white shadow-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="from-gini-300 to-gini-500 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br text-3xl shadow-lg">
                        {index === 0 ? '🐹' : '🤖'}
                      </div>
                    )}
                    {index === 0 && (
                      <span className="wiggle absolute -top-1 -right-1 text-xl">🎀</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <CardTitle className="font-fun flex items-center gap-2 text-2xl">
                      {displayName}
                      {index === 0 && <span className="sparkle text-sm">✨</span>}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge
                        variant="secondary"
                        className="text-gini-600 font-fun bg-white/80 text-xs"
                      >
                        {seller.specialty}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{about}</p>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/?seller=${seller.pubkey}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gini-300 hover:bg-gini-100 font-fun"
                    >
                      <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                      View Products
                    </Button>
                  </Link>

                  {seller.npub && seller.npub !== 'npub1...' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gini-purple hover:bg-gini-100 font-fun"
                      onClick={() => navigator.clipboard.writeText(seller.npub)}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Copy npub
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Become a Seller CTA */}
      <div className="mx-auto mt-16 max-w-3xl text-center">
        <Card className="bg-rainbow-gradient border-none p-1">
          <div className="rounded-lg bg-white p-8">
            <span className="mb-4 block text-5xl">🏪</span>
            <h2 className="font-fun mb-3 text-2xl font-bold">Want to Sell on Gini3D?</h2>
            <p className="text-muted-foreground mb-4">
              Are you a 3D printing maker on Nostr? We&apos;re always looking for awesome sellers
              who specialize in 3D printed products!
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                ✓ 3D Printing Focus
              </span>
              <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                ✓ Nostr Integration
              </span>
              <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                ✓ Bitcoin Payments
              </span>
            </div>
            <Link href="/contact">
              <Button className="btn-fun bg-gini-heart hover:bg-gini-500">
                <Star className="mr-2 h-4 w-4" />
                Apply to Become a Seller
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="text-center">
            <div className="float mb-4 text-4xl">🐹</div>
            <p className="font-fun text-gini-600">Loading sellers...</p>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed top-1/3 -right-16 text-6xl opacity-20">⭐</div>
      <div className="pointer-events-none fixed bottom-1/3 -left-16 text-6xl opacity-20">🌈</div>
    </div>
  );
}
