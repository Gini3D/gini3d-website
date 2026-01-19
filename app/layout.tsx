import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';

import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gini3D - Adorable 3D Printed Creations',
  description:
    'A cute 3D print marketplace run by Nini & Gabby. Shop unique 3D printed products with Bitcoin Lightning payments!',
  keywords: ['3D printing', 'marketplace', 'Bitcoin', 'Lightning', 'Nostr', 'cute', 'guinea pig'],
  authors: [{ name: 'Nini & Gabby' }],
  openGraph: {
    title: 'Gini3D - Adorable 3D Printed Creations',
    description: 'A cute 3D print marketplace run by Nini & Gabby',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
