'use client';

import { CheckCircle, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface OrderConfirmationProps {
  orderId: string;
  onClose: () => void;
}

export function OrderConfirmation({ orderId, onClose }: OrderConfirmationProps) {
  return (
    <div className="space-y-6 py-4 text-center">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="bg-gini-100 relative flex h-24 w-24 items-center justify-center rounded-full">
          <CheckCircle className="text-gini-500 h-12 w-12" />
          <span className="absolute -top-2 -right-2 text-2xl">🎉</span>
          <span className="absolute -bottom-2 -left-2 text-2xl">💖</span>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h3 className="font-fun mb-2 text-2xl font-bold text-green-600">Payment Successful!</h3>
        <p className="text-muted-foreground">
          Thank you for your order! We&apos;re so excited to send you your adorable 3D prints! 🐹
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-gini-50 rounded-lg p-4">
        <p className="text-sm">
          <span className="text-muted-foreground">Order ID: </span>
          <span className="font-mono font-medium">{orderId.slice(0, 8)}...</span>
        </p>
      </div>

      {/* Fun Message */}
      <div className="space-y-2">
        <div className="flex justify-center gap-2 text-2xl">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
            💖
          </span>
          <span className="animate-bounce" style={{ animationDelay: '100ms' }}>
            🐹
          </span>
          <span className="animate-bounce" style={{ animationDelay: '200ms' }}>
            ✨
          </span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
            🎀
          </span>
          <span className="animate-bounce" style={{ animationDelay: '400ms' }}>
            💜
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          We&apos;ll start working on your order right away!
        </p>
      </div>

      {/* What&apos;s Next */}
      <div className="border-gini-200 rounded-lg border p-4 text-left">
        <h4 className="font-fun mb-2 font-medium">What happens next?</h4>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">1.</span>
            <span>We&apos;ll print your items with love and care</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">2.</span>
            <span>Pack them up with cute stickers 🌟</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">3.</span>
            <span>Ship them to you as fast as we can!</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onClose}
          className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
          size="lg"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Continue Shopping
        </Button>
      </div>

      {/* Thank You Note */}
      <p className="text-gini-500 font-fun text-sm">
        Thank you for supporting Gini3D! 💕
        <br />- Nini & Gabby
      </p>
    </div>
  );
}
