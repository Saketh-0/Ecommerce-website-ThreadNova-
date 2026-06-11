import { Metadata } from 'next';
import { getAllProducts } from '@/lib/actions/product.actions';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - Products',
};

export default async function AdminProductsPage() {
  const products = await getAllProducts({ query: 'all', page: 1, limit: 50 });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Rating</th>
                  <th className="text-left p-4 font-medium">Featured</th>
                </tr>
              </thead>
              <tbody>
                {products.data.map((product: any) => (
                  <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <Link href={`/product/${product.slug}`} className="font-medium hover:text-orange-500 transition-colors">
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4 font-semibold">{formatCurrency(Number(product.price))}</td>
                    <td className="p-4">
                      <Badge variant={product.stock > 0 ? 'outline' : 'destructive'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Badge>
                    </td>
                    <td className="p-4">{Number(product.rating).toFixed(1)} ⭐</td>
                    <td className="p-4">
                      {product.isFeatured && (
                        <Badge className="bg-orange-500">Featured</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
