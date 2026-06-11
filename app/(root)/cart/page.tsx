import { Metadata } from 'next';
import { getMyCart } from '@/lib/actions/cart.actions';
import CartTable from './cart-table';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <div className="py-8">
      <h1 className="h2-bold mb-6">Shopping Cart</h1>
      <CartTable cart={cart} />
    </div>
  );
}
