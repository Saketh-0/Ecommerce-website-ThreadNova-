'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useState, useTransition } from 'react';
import type { Cart } from '@/types';

const AddToCart = ({
  item,
  cart,
}: {
  item: { productId: string; name: string; slug: string; price: number; image: string; };
  cart?: Cart;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const existItem = cart?.items.find((i) => i.productId === item.productId);

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        qty: 1,
        image: item.image,
        price: item.price,
      });
      if (res.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        router.refresh();
      } else {
        alert(res.message || 'Failed to add item to cart');
        if (res.message?.toLowerCase().includes('sign in')) {
          router.push('/sign-in');
        }
      }
    });
  };

  return existItem ? (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => {
          startTransition(async () => {
            const { removeItemFromCart } = await import('@/lib/actions/cart.actions');
            await removeItemFromCart(item.productId);
            router.refresh();
          });
        }}
        disabled={isPending}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold w-8 text-center">{existItem.qty}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        'Adding...'
      ) : added ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Added!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add To Cart
        </>
      )}
    </Button>
  );
};

export default AddToCart;
