import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Badge } from "@/components/ui/badge";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/cart/add-to-cart";
import { Star } from "lucide-react";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: 'Product Not Found' };
    return {
        title: product.name,
        description: product.description,
    };
}

const ProductDetailsPage = async (props: {
    params: Promise<{ slug: string }>
}) => {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const cart = await getMyCart();

    return <>
    <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Product Images */}
            <div className="col-span-2">
                <ProductImages images={product.images} />
            </div>
            {/* Product Info */}
            <div className="col-span-2">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{product.brand} · {product.category}</p>
                    </div>
                    <h1 className="h3-bold">{product.name}</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(Number(product.rating)) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {Number(product.rating).toFixed(1)} ({product.numReviews} reviews)
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <ProductPrice value={Number(product.price)} className="bg-orange-50 dark:bg-orange-950/30 w-fit rounded-full px-5 py-2"></ProductPrice>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
            </div>
            {/* Action Card */}
            <div>
                <Card className="sticky top-24">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Price</span>
                            <ProductPrice value={Number(product.price)} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            {product.stock > 0 ? (
                                <Badge variant="outline" className="border-green-500 text-green-600">In Stock</Badge>
                            ) : (
                                <Badge variant="destructive">Out Of Stock</Badge>
                            )}
                        </div>
                        {product.stock > 0 && (
                            <div className="pt-2">
                                <AddToCart
                                    item={{
                                        productId: product.id,
                                        name: product.name,
                                        slug: product.slug,
                                        price: Number(product.price),
                                        image: product.images[0],
                                    }}
                                    cart={cart}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
    </>;
}

export default ProductDetailsPage;