'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

export default function StripePayment({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        // Redirect to Stripe checkout (or simulated mock payment page)
        window.location.href = data.url;
      } else {
        setError(data.message || 'Payment initiation failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {error && (
        <div className="text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-lg text-center">
          {error}
        </div>
      )}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-md shadow-orange-500/20 py-5 rounded-xl transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now with Stripe
          </>
        )}
      </Button>
    </div>
  );
}
