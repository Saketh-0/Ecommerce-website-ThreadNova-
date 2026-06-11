import { Metadata } from 'next';
import { getOrderById, markOrderAsPaid } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Clock, Package, Truck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StripePayment from '@/components/shared/order/stripe-payment';

export const metadata: Metadata = {
  title: 'Order Confirmation',
};

export default async function OrderPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const isMockSuccess = searchParams.mock_success === 'true';

  let order = await getOrderById(id);
  if (!order) notFound();

  if (isMockSuccess && !order.isPaid) {
    await markOrderAsPaid(id);
    const reloaded = await getOrderById(id);
    if (reloaded) order = reloaded;
  }

  const shippingAddress = order.shippingAddress as { fullName: string; streetAddress: string; city: string; postalCode: string; country: string };

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground">Order ID: {order.id.substring(0, 8)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-full p-2 ${order.isPaid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                  {order.isPaid ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">Payment</p>
                  {order.isPaid ? (
                    <p className="text-xs text-green-600">Paid on {formatDateTime(order.paidAt!).dateOnly}</p>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-full p-2 ${order.isDelivered ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                  {order.isDelivered ? <Package className="h-5 w-5 text-green-500" /> : <Truck className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery</p>
                  {order.isDelivered ? (
                    <p className="text-xs text-green-600">Delivered on {formatDateTime(order.deliveredAt!).dateOnly}</p>
                  ) : (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">In Transit</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Shipping Address
              </h2>
              <p className="text-sm text-muted-foreground">
                {shippingAddress.fullName}<br />
                {shippingAddress.streetAddress}<br />
                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                {shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <Link href={`/product/${item.slug}`}>
                      <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-lg object-cover" />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${item.slug}`} className="font-medium hover:text-orange-500 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(Number(item.price) * item.qty)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{formatCurrency(Number(order.itemsPrice))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{Number(order.shippingPrice) === 0 ? 'Free' : formatCurrency(Number(order.shippingPrice))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(Number(order.taxPrice))}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-orange-500">{formatCurrency(Number(order.totalPrice))}</span>
                </div>
              </div>
              <div className="pt-2 text-xs text-muted-foreground text-center">
                Payment: {order.paymentMethod}
              </div>
              {!order.isPaid && (
                <div className="pt-2">
                  <StripePayment orderId={order.id} />
                </div>
              )}
              <Button asChild className="w-full" variant="outline">
                <Link href="/user/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" /> View All Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
