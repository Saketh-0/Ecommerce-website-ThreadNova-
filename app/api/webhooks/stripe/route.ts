import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/db/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn('Stripe webhook secret is missing. Processing webhook event raw (unsafe for production).');
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ message: 'Webhook Error', error: err.message }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            isPaid: true,
            paidAt: new Date(),
            paymentResult: {
              id: session.payment_intent || session.id,
              status: session.payment_status || 'succeeded',
              email_address: session.customer_details?.email || '',
            },
          },
        });
        console.log(`Order ${orderId} marked as PAID via Stripe Webhook`);
      } catch (dbError) {
        console.error(`Failed to update database for order ${orderId}:`, dbError);
        return NextResponse.json({ message: 'Database Update Failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
