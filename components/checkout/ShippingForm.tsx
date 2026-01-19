'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { Loader2, MapPin, Package, Store, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { SellerShippingSelection, ShippingInfo, StallShippingZone } from '@/lib/cartTypes';
import type { SellerOrder } from '@/lib/productUtils';

interface ShippingFormProps {
  onSubmit: (data: ShippingInfo) => void;
  isSubmitting: boolean;
  sellerOrders: SellerOrder[];
  getSellerShipping: (pubkey: string) => StallShippingZone[];
  getSellerCurrency: (pubkey: string) => string;
  convertToSats: (amount: number, currency: string) => number;
  onTotalChange: (totalSats: number) => void;
}

// Default shipping zones when seller has no stall defined
const DEFAULT_SHIPPING_ZONES: StallShippingZone[] = [
  { id: 'uk', name: 'United Kingdom', cost: 3.5, regions: ['UK', 'GB'] },
  { id: 'eu', name: 'Europe', cost: 8.0, regions: ['EU'] },
  { id: 'worldwide', name: 'Worldwide', cost: 15.0, regions: ['*'] },
];

export function ShippingForm({
  onSubmit,
  isSubmitting,
  sellerOrders,
  getSellerShipping,
  getSellerCurrency,
  convertToSats,
  onTotalChange,
}: ShippingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    message: '',
  });

  // Track selected shipping per seller
  const [sellerShippingSelections, setSellerShippingSelections] = useState<
    Record<string, { zoneId: string; cost: number; currency: string }>
  >({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get shipping options for a seller (from stall or defaults)
  const getShippingOptions = (pubkey: string): StallShippingZone[] => {
    const stallShipping = getSellerShipping(pubkey);
    if (stallShipping.length > 0) {
      return stallShipping;
    }
    // Return defaults if seller has no stall with shipping
    return DEFAULT_SHIPPING_ZONES;
  };

  // Calculate totals when shipping selections change
  useEffect(() => {
    let totalSats = 0;

    for (const order of sellerOrders) {
      // Add item subtotal
      totalSats += order.subtotalSats;

      // Add shipping if selected
      const selection = sellerShippingSelections[order.sellerPubkey];
      if (selection) {
        const shippingSats = convertToSats(selection.cost, selection.currency);
        totalSats += shippingSats;
      }
    }

    onTotalChange(totalSats);
  }, [sellerOrders, sellerShippingSelections, convertToSats, onTotalChange]);

  const handleShippingChange = (pubkey: string, zoneId: string) => {
    const options = getShippingOptions(pubkey);
    const zone = options.find((z) => z.id === zoneId);
    const currency = getSellerCurrency(pubkey) || 'GBP';

    setSellerShippingSelections((prev) => ({
      ...prev,
      [pubkey]: {
        zoneId,
        cost: zone?.cost || 0,
        currency,
      },
    }));

    // Clear error if exists
    if (errors[`shipping_${pubkey}`]) {
      setErrors((prev) => ({ ...prev, [`shipping_${pubkey}`]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate shipping selection for each seller
    for (const order of sellerOrders) {
      if (!sellerShippingSelections[order.sellerPubkey]) {
        newErrors[`shipping_${order.sellerPubkey}`] = 'Please select a shipping option';
      }
    }

    // Email is optional but must be valid if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build per-seller shipping selections
    const sellerShipping: SellerShippingSelection[] = sellerOrders.map((order) => {
      const selection = sellerShippingSelections[order.sellerPubkey];
      return {
        sellerPubkey: order.sellerPubkey,
        shippingZoneId: selection?.zoneId || '',
        shippingCost: selection?.cost || 0,
      };
    });

    const shippingInfo: ShippingInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      sellerShipping,
      message: formData.message || undefined,
    };

    onSubmit(shippingInfo);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    const currLower = currency.toLowerCase();
    if (currLower === 'sats' || currLower === 'sat') {
      return `${amount.toLocaleString()} sats`;
    }
    if (currLower === 'gbp' || currency === '£') {
      return `£${amount.toFixed(2)}`;
    }
    if (currLower === 'eur' || currency === '€') {
      return `€${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatSats = (sats: number) => `${Math.round(sats).toLocaleString()} sats`;

  // Calculate total sats for display
  const calculateTotal = () => {
    let subtotalSats = 0;
    let shippingSats = 0;

    for (const order of sellerOrders) {
      subtotalSats += order.subtotalSats;
      const selection = sellerShippingSelections[order.sellerPubkey];
      if (selection) {
        shippingSats += convertToSats(selection.cost, selection.currency);
      }
    }

    return { subtotalSats, shippingSats, totalSats: subtotalSats + shippingSats };
  };

  const totals = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Per-Seller Shipping Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-pink-500" />
          <h3 className="font-fun text-lg font-medium">Shipping Options</h3>
        </div>

        {sellerOrders.map((order) => {
          const shippingOptions = getShippingOptions(order.sellerPubkey);
          const currency = getSellerCurrency(order.sellerPubkey) || 'GBP';
          const selection = sellerShippingSelections[order.sellerPubkey];
          const errorKey = `shipping_${order.sellerPubkey}`;

          return (
            <div
              key={order.sellerPubkey}
              className="border-gini-200 space-y-2 rounded-lg border p-3"
            >
              {/* Seller header */}
              <div className="mb-2 flex items-center gap-2">
                {order.sellerPicture ? (
                  <Image
                    src={order.sellerPicture}
                    alt={order.sellerName}
                    width={20}
                    height={20}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <Store className="text-gini-500 h-4 w-4" />
                )}
                <span className="font-fun text-sm font-medium">{order.sellerName}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Shipping dropdown */}
              <Select
                value={selection?.zoneId || ''}
                onValueChange={(value) => handleShippingChange(order.sellerPubkey, value)}
              >
                <SelectTrigger className={errors[errorKey] ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select shipping option" />
                </SelectTrigger>
                <SelectContent>
                  {shippingOptions.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name || zone.id} -{' '}
                      {zone.cost === 0 ? 'Free' : formatPrice(zone.cost, currency)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[errorKey] && <p className="text-sm text-red-500">{errors[errorKey]}</p>}

              {/* Order subtotal */}
              <div className="text-muted-foreground flex justify-between pt-1 text-xs">
                <span>Items: {formatSats(order.subtotalSats)}</span>
                {selection && (
                  <span>
                    Shipping: {formatSats(convertToSats(selection.cost, selection.currency))}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Order Total */}
        <div className="bg-gini-50 space-y-1 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatSats(totals.subtotalSats)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatSats(totals.shippingSats)}</span>
          </div>
          <div className="border-gini-200 flex justify-between border-t pt-1 font-medium">
            <span className="font-fun">Total</span>
            <div className="text-gini-600 flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-fun">{formatSats(totals.totalSats)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-pink-500" />
          <h3 className="font-fun text-lg font-medium">Shipping Address (optional)</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Nini & Gabby"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="border-gini-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="123 Guinea Pig Lane"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="border-gini-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Cutetown"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="border-gini-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="TX"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="border-gini-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="12345"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className="border-gini-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="United States"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="border-gini-200"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-fun text-lg font-medium">Contact Info</h3>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="nini@gini3d.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : 'border-gini-200'}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="border-gini-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Order Notes (optional)</Label>
          <Textarea
            id="message"
            placeholder="Any special instructions for your order?"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="border-gini-200"
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn-fun bg-gini-heart hover:bg-gini-500 w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Continue to Payment</>
        )}
      </Button>
    </form>
  );
}
