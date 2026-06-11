import { Metadata } from 'next';
import CheckoutForm from './checkout-form';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getMyCart } from '@/lib/actions/cart.actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const userAddress = user.address as { fullName?: string; streetAddress?: string; city?: string; postalCode?: string; country?: string } | null;

  return (
    <div className="py-8">
      <h1 className="h2-bold mb-6">Checkout</h1>
      <CheckoutForm cart={cart} userAddress={userAddress} />
    </div>
  );
}
