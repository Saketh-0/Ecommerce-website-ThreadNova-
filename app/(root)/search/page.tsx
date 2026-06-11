import { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/actions/product.actions';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Search Products',
};

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = searchParams;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  const prices = [
    { name: 'Any', value: 'all' },
    { name: '₹1 - ₹500', value: '1-500' },
    { name: '₹500 - ₹1000', value: '500-1000' },
    { name: '₹1000 - ₹2000', value: '1000-2000' },
    { name: '₹2000+', value: '2000-100000' },
  ];

  const ratings = [
    { name: 'Any', value: 'all' },
    { name: '4★ & Up', value: '4' },
    { name: '3★ & Up', value: '3' },
    { name: '2★ & Up', value: '2' },
  ];

  const sortOptions = [
    { name: 'Newest', value: 'newest' },
    { name: 'Price: Low to High', value: 'lowest' },
    { name: 'Price: High to Low', value: 'highest' },
    { name: 'Top Rated', value: 'rating' },
  ];

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams({
      q, category, price, rating, sort, page: '1',
      ...params,
    });
    return `/search?${sp.toString()}`;
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h2-bold">
            {q !== 'all' ? `Results for "${q}"` : 'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.data.length} product{products.data.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Category</h3>
            <div className="space-y-1">
              <Link
                href={buildUrl({ category: 'all' })}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === 'all' ? 'bg-orange-500 text-white' : 'hover:bg-muted'}`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={buildUrl({ category: c })}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === c ? 'bg-orange-500 text-white' : 'hover:bg-muted'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Price</h3>
            <div className="space-y-1">
              {prices.map((p) => (
                <Link
                  key={p.value}
                  href={buildUrl({ price: p.value })}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${price === p.value ? 'bg-orange-500 text-white' : 'hover:bg-muted'}`}
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Rating</h3>
            <div className="space-y-1">
              {ratings.map((r) => (
                <Link
                  key={r.value}
                  href={buildUrl({ rating: r.value })}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${rating === r.value ? 'bg-orange-500 text-white' : 'hover:bg-muted'}`}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-4">
          {/* Sort */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            {sortOptions.map((s) => (
              <Button
                key={s.value}
                asChild
                variant={sort === s.value ? 'default' : 'outline'}
                size="sm"
                className={sort === s.value ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                <Link href={buildUrl({ sort: s.value })}>{s.name}</Link>
              </Button>
            ))}
          </div>

          {products.data.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/search">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.data.map((product: any) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
              {/* Pagination */}
              {products.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: products.totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      asChild
                      variant={Number(page) === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      className={Number(page) === i + 1 ? 'bg-orange-500' : ''}
                    >
                      <Link href={buildUrl({ page: String(i + 1) })}>{i + 1}</Link>
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
