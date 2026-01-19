'use client';

import { useState } from 'react';

import { Loader2, MapPin } from 'lucide-react';

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

import type { ShippingInfo } from '@/lib/cartTypes';

interface ShippingFormProps {
  onSubmit: (data: ShippingInfo) => void;
  isSubmitting: boolean;
}

const SHIPPING_ZONES = [
  { id: 'us', label: 'United States', price: '0', currency: 'USD' },
  { id: 'canada', label: 'Canada', price: '5', currency: 'USD' },
  { id: 'worldwide', label: 'Worldwide', price: '15', currency: 'USD' },
];

export function ShippingForm({ onSubmit, isSubmitting }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    shippingZone: 'us',
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shippingZone) {
      newErrors.shippingZone = 'Please select a shipping zone';
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

    const shippingInfo: ShippingInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      shippingZone: formData.shippingZone,
      message: formData.message || undefined,
    };

    onSubmit(shippingInfo);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Zone */}
      <div className="space-y-2">
        <Label htmlFor="shippingZone" className="font-fun">
          Shipping Zone *
        </Label>
        <Select
          value={formData.shippingZone}
          onValueChange={(value) => handleChange('shippingZone', value)}
        >
          <SelectTrigger className={errors.shippingZone ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select shipping zone" />
          </SelectTrigger>
          <SelectContent>
            {SHIPPING_ZONES.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.label} - {zone.price === '0' ? 'Free' : `$${zone.price}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shippingZone && <p className="text-sm text-red-500">{errors.shippingZone}</p>}
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
            placeholder="Any special instructions for your order? 🐹"
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
