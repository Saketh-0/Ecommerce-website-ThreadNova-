import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_stripe_key_for_compilation', {
  apiVersion: '2025-01-27-previews.0' as any, // fallback for typescript compilation with different library updates
  appInfo: {
    name: 'ThreadNova Store',
    version: '0.1.0',
  },
});
