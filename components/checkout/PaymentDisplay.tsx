'use client';

import { useState, useEffect } from 'react';

import { Check, Copy, ExternalLink, Loader2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { convertToSats } from '@/lib/gammaOrderUtils';

interface PaymentDisplayProps {
  orderId: string;
  totalSats: number;
  currency: string;
  onPaymentComplete: () => void;
}

export function PaymentDisplay({
  orderId,
  totalSats,
  currency,
  onPaymentComplete,
}: PaymentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Convert to sats if needed
  const satsAmount = currency.toLowerCase() === 'sat' || currency.toLowerCase() === 'sats'
    ? totalSats
    : convertToSats(totalSats, currency);

  // For demo purposes, generate a mock Lightning invoice
  // In production, this would come from the merchant via Kind 16 subscription
  const mockInvoice = `lnbc${satsAmount}n1pn...demo_invoice_${orderId.slice(0, 8)}`;

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        // Dynamic import for QR code generation
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(mockInvoice.toUpperCase(), {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    };

    generateQR();
  }, [mockInvoice]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mockInvoice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInWallet = () => {
    window.open(`lightning:${mockInvoice}`, '_blank');
  };

  // For demo: simulate payment after a delay
  const handleSimulatePayment = () => {
    onPaymentComplete();
  };

  return (
    <div className="space-y-6">
      {/* Amount Display */}
      <div className="py-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="font-fun text-3xl font-bold text-yellow-600">
            {satsAmount.toLocaleString()} sats
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Pay with Bitcoin Lightning to complete your order ⚡
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <Card className="bg-gini-50 border-gini-200 p-4">
          <CardContent className="p-0">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Lightning Invoice QR Code"
                className="h-48 w-48 rounded object-contain"
              />
            ) : (
              <div className="bg-gini-100 flex h-48 w-48 items-center justify-center rounded">
                <Loader2 className="text-gini-500 h-8 w-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Input */}
      <div className="space-y-2">
        <Label className="font-fun">Lightning Invoice</Label>
        <div className="flex gap-2">
          <Input
            value={mockInvoice}
            readOnly
            className="border-gini-200 font-mono text-xs"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="border-gini-200 shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        <Button
          onClick={openInWallet}
          variant="outline"
          className="border-gini-300 hover:bg-gini-100 w-full"
          size="lg"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in Lightning Wallet
        </Button>

        {/* Demo: Simulate payment button */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="mb-3 text-center text-sm text-yellow-800">
            <strong>Demo Mode:</strong> Click below to simulate a successful payment
          </p>
          <Button
            onClick={handleSimulatePayment}
            className="bg-gini-heart hover:bg-gini-500 w-full"
            size="lg"
          >
            <Zap className="mr-2 h-4 w-4" />
            Simulate Payment
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Scan the QR code or copy the invoice to pay with any Lightning wallet.
          <br />
          Order ID: {orderId.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
}
