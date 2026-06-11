"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-muted/30">
        <Image
          src={images[current]}
          alt="product image"
          width={1000}
          height={1000}
          className="min-h-[300px] object-cover object-center transition-all duration-500"
        />
      </div>
      <div className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'rounded-lg border-2 overflow-hidden transition-all duration-200 hover:opacity-100',
              current === index
                ? 'border-orange-500 opacity-100 scale-105'
                : 'border-transparent opacity-60'
            )}
          >
            <Image
              src={image}
              alt="product thumbnail"
              width={100}
              height={100}
              className="object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;