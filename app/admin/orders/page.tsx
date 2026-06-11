import { Metadata } from 'next';
import { getAllOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import AdminOrderActions from './order-actions';

export const metadata: Metadata = {
  title: 'Admin - Orders',
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Paid</th>
                  <th className="text-left p-4 font-medium">Delivered</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.data.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-xs">{formatId(order.id)}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-xs text-muted-foreground">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDateTime(order.createdAt).dateOnly}</td>
                      <td className="p-4 font-semibold">{formatCurrency(Number(order.totalPrice))}</td>
                      <td className="p-4">
                        <Badge variant={order.isPaid ? 'default' : 'outline'} className={order.isPaid ? 'bg-green-500' : ''}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={order.isDelivered ? 'default' : 'outline'} className={order.isDelivered ? 'bg-green-500' : ''}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/order/${order.id}`} className="text-orange-500 hover:underline text-xs">
                            View
                          </Link>
                          <AdminOrderActions orderId={order.id} isPaid={order.isPaid} isDelivered={order.isDelivered} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
