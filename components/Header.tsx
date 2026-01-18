'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Heart, LogIn, LogOut, Mail, Menu, ShoppingCart, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

import { LoginDialog } from './LoginDialog';

export function Header() {
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="border-gini-200 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🐹</span>
            <span className="font-logo text-primary text-2xl">Gini3D</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="font-elegance text-foreground/80 hover:text-primary text-lg transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="font-elegance text-foreground/80 hover:text-primary text-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/sellers"
              className="font-elegance text-foreground/80 hover:text-primary text-lg transition-colors"
            >
              Sellers
            </Link>
            <Link
              href="/contact"
              className="font-elegance text-foreground/80 hover:text-primary flex items-center gap-1 text-lg transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gini-100 relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="text-primary h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b9d] font-sans text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoading ? (
                <div className="bg-gini-100 h-8 w-20 animate-pulse rounded-md" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-gini-100 gap-2">
                      {user.picture ? (
                        <Image
                          src={user.picture}
                          alt={user.displayName || user.name || 'User'}
                          width={28}
                          height={28}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="bg-gini-200 flex h-7 w-7 items-center justify-center rounded-full">
                          <User className="text-gini-600 h-4 w-4" />
                        </div>
                      )}
                      <span className="font-fun text-sm">
                        {user.displayName || user.name || 'Nostr User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-fun text-muted-foreground text-xs">
                      {user.npub.slice(0, 12)}...{user.npub.slice(-8)}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setLoginOpen(true)}
                    className="hover:bg-gini-100 font-fun gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                  <Button
                    onClick={() => setLoginOpen(true)}
                    className="btn-fun bg-gini-heart hover:bg-gini-500 font-fun gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-gini-100">
                  <Menu className="text-primary h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <nav className="mt-8 flex flex-col gap-4">
                  <Link
                    href="/"
                    className="font-elegance text-foreground/80 hover:text-primary flex items-center gap-2 text-xl transition-colors"
                  >
                    <Heart className="h-4 w-4 text-[#ff6b9d]" />
                    Shop
                  </Link>
                  <Link
                    href="/about"
                    className="font-elegance text-foreground/80 hover:text-primary flex items-center gap-2 text-xl transition-colors"
                  >
                    <Heart className="h-4 w-4 text-[#ff6b9d]" />
                    About Us
                  </Link>
                  <Link
                    href="/sellers"
                    className="font-elegance text-foreground/80 hover:text-primary flex items-center gap-2 text-xl transition-colors"
                  >
                    <Heart className="h-4 w-4 text-[#ff6b9d]" />
                    Sellers
                  </Link>
                  <Link
                    href="/contact"
                    className="font-elegance text-foreground/80 hover:text-primary flex items-center gap-2 text-xl transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#ff6b9d]" />
                    Contact
                  </Link>

                  {/* Mobile Auth */}
                  <div className="border-gini-200 mt-4 border-t pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {user.picture ? (
                            <Image
                              src={user.picture}
                              alt={user.displayName || user.name || 'User'}
                              width={32}
                              height={32}
                              className="rounded-full"
                              unoptimized
                            />
                          ) : (
                            <div className="bg-gini-200 flex h-8 w-8 items-center justify-center rounded-full">
                              <User className="text-gini-600 h-4 w-4" />
                            </div>
                          )}
                          <span className="font-fun text-sm">
                            {user.displayName || user.name || 'Nostr User'}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full justify-start gap-2 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => setLoginOpen(true)}
                          className="w-full justify-start gap-2"
                        >
                          <LogIn className="h-4 w-4" />
                          Log in
                        </Button>
                        <Button
                          onClick={() => setLoginOpen(true)}
                          className="bg-gini-heart hover:bg-gini-500 w-full justify-start gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
