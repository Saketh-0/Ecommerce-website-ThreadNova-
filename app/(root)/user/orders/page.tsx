import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Orders',
};

export default async function UserOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const orders = await getMyOrders();

  return (
    <div className="py-8">
      <h1 className="h2-bold mb-6">My Orders</h1>
      {orders.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.data.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.substring(0, 8)}... · {formatDateTime(order.createdAt).dateOnly}
                    </p>
                    <p className="font-medium">
                      {order.orderItems.map((i: { name: string }) => i.name).join(', ')}
                    </p>
                    <p className="text-lg font-semibold text-orange-500">
                      {formatCurrency(Number(order.totalPrice))}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Badge variant={order.isPaid ? 'default' : 'outline'} className={order.isPaid ? 'bg-green-500' : ''}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                      <Badge variant={order.isDelivered ? 'default' : 'outline'} className={order.isDelivered ? 'bg-green-500' : ''}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </Badge>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/order/${order.id}`}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
