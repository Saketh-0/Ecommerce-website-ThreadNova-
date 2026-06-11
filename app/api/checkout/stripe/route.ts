import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { prisma } from '@/db/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized order' }, { status: 401 });
    }

    if (order.isPaid) {
      return NextResponse.json({ success: false, message: 'Order is already paid' }, { status: 400 });
    }

    // Check if Stripe API Keys are set
    const hasStripeKeys = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'mock_stripe_key_for_compilation';
    
    if (!hasStripeKeys) {
      console.warn("Stripe key is missing or set to mock. Falling back to immediate simulated payment completion link.");
      // Redirect to a simulated successful order page with query flag to trigger client-side mock check
      const mockUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${order.id}?mock_success=true`;
      return NextResponse.json({ success: true, url: mockUrl });
    }

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${item.image}`],
        },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe expects amounts in cents/paise
      },
      quantity: item.qty,
    }));

    // Generate Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${order.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${order.id}?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
