'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { updateShippingAddress, createOrder } from '@/lib/actions/order.actions';
import { MapPin, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import type { Cart } from '@/types';

const CheckoutForm = ({
  cart,
  userAddress,
}: {
  cart: Cart;
  userAddress: { fullName?: string; streetAddress?: string; city?: string; postalCode?: string; country?: string } | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(userAddress?.fullName ? 2 : 1);
  const [address, setAddress] = useState({
    fullName: userAddress?.fullName || '',
    streetAddress: userAddress?.streetAddress || '',
    city: userAddress?.city || '',
    postalCode: userAddress?.postalCode || '',
    country: userAddress?.country || 'India',
  });
  const [error, setError] = useState('');

  const handleSaveAddress = () => {
    if (!address.fullName || !address.streetAddress || !address.city || !address.postalCode || !address.country) {
      setError('Please fill in all fields');
      return;
    }
    startTransition(async () => {
      const res = await updateShippingAddress(address);
      if (res.success) {
        setStep(2);
        setError('');
      } else {
        setError(res.message);
      }
    });
  };

  const handlePlaceOrder = () => {
    startTransition(async () => {
      const res = await createOrder();
      if (res.success && res.orderId) {
        router.push(`/order/${res.orderId}`);
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Shipping Address */}
        <Card className={step === 1 ? 'ring-2 ring-orange-500' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-full p-2 ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-muted'}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              {step > 1 && (
                <button onClick={() => setStep(1)} className="ml-auto text-sm text-orange-500 hover:underline">
                  Edit
                </button>
              )}
            </div>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Country</label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="India"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="123 Main St, Apt 4"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="Hyderabad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="500001"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveAddress}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isPending}
                >
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Continue'}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {address.fullName}, {address.streetAddress}, {address.city}, {address.postalCode}, {address.country}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Payment & Place Order */}
        <Card className={step === 2 ? 'ring-2 ring-orange-500' : 'opacity-50'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-full p-2 ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-muted'}`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>
            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">Cash On Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3"
                  disabled={isPending}
                >
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</>
                  ) : (
                    `Place Order · ${formatCurrency(cart.totalPrice)}`
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cart.shippingPrice === 0 ? 'Free' : formatCurrency(cart.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span>{formatCurrency(cart.taxPrice)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-orange-500">{formatCurrency(cart.totalPrice)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="col-span-full">
          <p className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg py-3">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
