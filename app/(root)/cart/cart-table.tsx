'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import type { Cart } from '@/types';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Link href="/">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-4">
        {cart.items.map((item) => (
          <Card key={item.productId} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Link href={`/product/${item.slug}`} className="shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-medium hover:text-orange-500 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await removeItemFromCart(item.productId);
                        router.refresh();
                      })
                    }
                  >
                    {item.qty === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await addItemToCart({
                          productId: item.productId,
                          name: item.name,
                          slug: item.slug,
                          qty: 1,
                          image: item.image,
                          price: item.price,
                        });
                        router.refresh();
                      })
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold">{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({cart.items.reduce((a, c) => a + c.qty, 0)})</span>
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
            {cart.itemsPrice < 500 && (
              <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2 text-center">
                Add ₹{Math.ceil(500 - cart.itemsPrice)} more for free shipping!
              </p>
            )}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              disabled={isPending}
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartTable;
