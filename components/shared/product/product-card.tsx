import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Star } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="w-full max-w-sm group overflow-hidden hover:shadow-lg transition-all duration-300 border-transparent hover:border-orange-200 dark:hover:border-orange-900">
      <CardHeader className="p-0 items-center overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className="object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
            <span className="text-xs font-medium">{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h2>
        </Link>
        <div className="flex-between gap-4">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-lg" />
          ) : (
            <p className="text-destructive text-sm font-medium">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;