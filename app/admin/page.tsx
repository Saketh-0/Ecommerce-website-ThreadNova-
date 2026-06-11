import { Metadata } from 'next';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const summary = await getOrderSummary();

  const stats = [
    {
      title: 'Total Sales',
      value: formatCurrency(Number(summary.totalSales)),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Orders',
      value: summary.ordersCount.toString(),
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Products',
      value: summary.productsCount.toString(),
      icon: Package,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Users',
      value: summary.usersCount.toString(),
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-full bg-gradient-to-br ${stat.color} p-3`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-orange-500 hover:underline">
              View All
            </Link>
          </div>
          {summary.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {summary.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt).dateTime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{formatCurrency(Number(order.totalPrice))}</span>
                    <Badge variant={order.isPaid ? 'default' : 'outline'} className={`text-xs ${order.isPaid ? 'bg-green-500' : ''}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
