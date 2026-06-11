import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import HeroCarousel from "@/components/shared/hero-carousel";
import AnimateOnScroll from "@/components/shared/animate-on-scroll";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import Image from "next/image";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Carousel */}
      <section className="mt-4">
        <HeroCarousel featuredProducts={featuredProducts} />
      </section>

      {/* Features Bar */}
      <AnimateOnScroll>
        <section className="py-8 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Orders over ₹500' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7 days return' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated help' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="rounded-full bg-orange-100 dark:bg-orange-950/40 p-2.5 shrink-0">
                  <feature.icon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimateOnScroll>

      {/* Latest Products */}
      <AnimateOnScroll delay={0.1}>
        <ProductList data={latestProducts} title="Newest Arrivals" />
      </AnimateOnScroll>

      {/* Promo Banner */}
      <AnimateOnScroll>
        <section className="my-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl shadow-orange-500/10">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
            <div className="text-white mb-6 md:mb-0">
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Limited Time Offer</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Up to 50% Off</h2>
              <p className="mt-2 text-white/80 max-w-md">Discover the latest trends at unbeatable prices. Premium quality at wallet-friendly rates.</p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/search">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <Image src="/images/promo.jpg" alt="promo" fill className="object-cover" />
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/5" />
        </section>
      </AnimateOnScroll>

      {/* Browse by Category */}
      <AnimateOnScroll delay={0.15}>
        <section className="my-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="h2-bold">Shop by Category</h2>
            <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-600">
              <Link href="/search">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Men's Dress Shirts", gradient: 'from-blue-500 to-indigo-600', emoji: '👔' },
              { name: "Men's Sweatshirts", gradient: 'from-violet-500 to-purple-600', emoji: '🧥' },
              { name: "Accessories", gradient: 'from-emerald-500 to-teal-600', emoji: '⌚' },
              { name: "Women's Tops", gradient: 'from-rose-500 to-pink-600', emoji: '👚' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                className={`bg-gradient-to-br ${cat.gradient} rounded-2xl p-6 text-white hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden`}
              >
                <div className="absolute top-3 right-3 text-3xl opacity-30 group-hover:opacity-60 transition-opacity">
                  {cat.emoji}
                </div>
                <p className="font-bold text-lg relative z-10">{cat.name}</p>
                <p className="text-sm text-white/70 mt-1 relative z-10 group-hover:text-white/90 transition-colors">Explore →</p>
              </Link>
            ))}
          </div>
        </section>
      </AnimateOnScroll>

      {/* Newsletter / CTA */}
      <AnimateOnScroll>
        <section className="my-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Get exclusive access to new arrivals, sales, and style tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full px-8 text-white shadow-lg shadow-orange-500/20">
              Subscribe
            </Button>
          </div>
        </section>
      </AnimateOnScroll>
    </>
  );
};

export default Homepage;
