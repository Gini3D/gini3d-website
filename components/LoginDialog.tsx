'use client';

import { useState } from 'react';

import { Eye, EyeOff, Key, Loader2, LogIn, Puzzle, Shield, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LoginTab = 'extension' | 'key';

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login, loginWithKey, isExtensionAvailable, isLoading, error } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginTab>('extension');
  const [nsecInput, setNsecInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleExtensionLogin = async () => {
    setLocalError(null);
    try {
      await login();
      onOpenChange(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleKeyLogin = async () => {
    setLocalError(null);
    if (!nsecInput.trim()) {
      setLocalError('Please enter your nsec or private key');
      return;
    }
    try {
      await loginWithKey(nsecInput.trim());
      setNsecInput('');
      onOpenChange(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid key');
    }
  };

  const displayError = localError || error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">🐹</span>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>
          <DialogTitle className="font-fun gradient-text text-2xl">Welcome to Gini3D!</DialogTitle>
          <DialogDescription>Sign in with your Nostr account to start shopping</DialogDescription>
        </DialogHeader>

        {/* New to Nostr CTA */}
        <div className="bg-gini-gradient rounded-lg p-4 text-center">
          <p className="font-fun mb-2 font-medium">New to Nostr? 🌟</p>
          <p className="text-muted-foreground mb-3 text-sm">
            Create a free account to get started!
          </p>
          <Button
            variant="outline"
            className="border-gini-300 hover:bg-white"
            onClick={() => window.open('https://nosta.me', '_blank')}
          >
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            Sign Up
          </Button>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">Or log in</p>

          {/* Tab Buttons */}
          <div className="flex rounded-lg border p-1">
            <button
              onClick={() => setActiveTab('extension')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'extension'
                  ? 'bg-gini-100 text-gini-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Puzzle className="h-4 w-4" />
              Extension
            </button>
            <button
              onClick={() => setActiveTab('key')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'key'
                  ? 'bg-gini-100 text-gini-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Key className="h-4 w-4" />
              Key
            </button>
          </div>

          {/* Extension Tab */}
          {activeTab === 'extension' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-gini-100 rounded-full p-4">
                  <Shield className="text-gini-500 h-8 w-8" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Login with one click using a browser extension
              </p>
              <Button
                onClick={handleExtensionLogin}
                disabled={isLoading || !isExtensionAvailable}
                className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Login with Extension
              </Button>
              {!isExtensionAvailable && (
                <p className="text-muted-foreground text-xs">
                  No extension detected.{' '}
                  <a
                    href="https://getalby.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gini-purple hover:underline"
                  >
                    Get Alby
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://github.com/nickytonline/nos2x-firefox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gini-purple hover:underline"
                  >
                    nos2x
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Key Tab */}
          {activeTab === 'key' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>Warning:</strong> Entering your nsec is less secure than using an
                  extension. Your key is not stored, but use caution.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nsec" className="font-fun">
                  Private Key (nsec)
                </Label>
                <div className="relative">
                  <Input
                    id="nsec"
                    type={showKey ? 'text' : 'password'}
                    value={nsecInput}
                    onChange={(e) => setNsecInput(e.target.value)}
                    placeholder="nsec1..."
                    className="border-gini-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleKeyLogin}
                disabled={isLoading}
                className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Key className="mr-2 h-4 w-4" />
                )}
                Login with Key
              </Button>
            </div>
          )}

          {/* Error Display */}
          {displayError && (
            <p className="rounded-lg bg-red-50 p-2 text-center text-sm text-red-600">
              {displayError}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
