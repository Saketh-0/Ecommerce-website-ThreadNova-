'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

interface FeaturedProduct {
  slug: string;
  banner: string | null;
  name: string;
  description: string;
}

const HeroCarousel = ({ featuredProducts }: { featuredProducts: FeaturedProduct[] }) => {
  const [current, setCurrent] = useState(0);
  const bannerProducts = featuredProducts.filter((p) => p.banner);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animateSlide = useCallback(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  useEffect(() => {
    animateSlide();
  }, [current, animateSlide]);

  useEffect(() => {
    // Entrance animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (bannerProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerProducts.length]);

  if (bannerProducts.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        {bannerProducts.map((product, index) => (
          <div
            key={product.slug}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={(product.banner && product.banner.startsWith('http')) ? product.banner : `/images/${product.banner || ''}`}
              alt={product.name}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="wrapper">
                <div ref={index === current ? textRef : undefined} className="max-w-lg space-y-4">
                  <span className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-medium backdrop-blur-sm">
                    ✨ Featured Collection
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-md">
                    {product.description}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 rounded-full px-8"
                    >
                      <Link href={`/product/${product.slug}`}>Shop Now</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all px-8"
                    >
                      <Link href="/search">Explore All</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {bannerProducts.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + bannerProducts.length) % bannerProducts.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-3 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % bannerProducts.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-3 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {bannerProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-10 bg-orange-500' : 'w-2.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
