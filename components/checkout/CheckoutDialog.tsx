'use client';

import { useState } from 'react';

import { AlertCircle } from 'lucide-react';

import { LoginDialog } from '@/components/LoginDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

import type { ShippingInfo } from '@/lib/cartTypes';

import { OrderConfirmation } from './OrderConfirmation';
import { PaymentDisplay } from './PaymentDisplay';
import { ShippingForm } from './ShippingForm';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { user } = useAuth();
  const { totalPrice, currency, totalItems, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [, setShippingInfo] = useState<ShippingInfo | null>(null);

  const formatPrice = (amount: number, curr: string) => {
    if (curr.toLowerCase() === 'sats' || curr.toLowerCase() === 'sat') {
      return `${amount.toLocaleString()} sats`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const handleShippingSubmit = async (shipping: ShippingInfo) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setShippingInfo(shipping);

    try {
      // Generate order ID
      const newOrderId = crypto.randomUUID();
      setOrderId(newOrderId);

      // Move to payment step
      // Note: In a full implementation, we would publish a Kind 16 event here
      // For now, we'll just move to the payment display
      setStep('payment');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit order';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    clearCart();
    setStep('confirmation');
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep('shipping');
      setError(null);
      setOrderId(null);
      setShippingInfo(null);
    }, 300);
  };

  const getDialogTitle = () => {
    switch (step) {
      case 'shipping':
        return 'Checkout';
      case 'payment':
        return 'Payment';
      case 'confirmation':
        return 'Order Complete! 🎉';
      default:
        return 'Checkout';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-fun text-xl">{getDialogTitle()}</DialogTitle>
            <DialogDescription className="sr-only">
              Complete your order by filling in the shipping details and payment information.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'shipping' && (
            <div className="space-y-4">
              <div className="bg-gini-100 rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">{totalItems} item(s)</span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="text-gini-600 font-medium">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </p>
              </div>

              <ShippingForm onSubmit={handleShippingSubmit} isSubmitting={isSubmitting} />
            </div>
          )}

          {step === 'payment' && orderId && (
            <PaymentDisplay
              orderId={orderId}
              totalSats={totalPrice}
              currency={currency}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {step === 'confirmation' && orderId && (
            <OrderConfirmation orderId={orderId} onClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
