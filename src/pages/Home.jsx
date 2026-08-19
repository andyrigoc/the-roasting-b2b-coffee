import { useState, useEffect } from "react";
import { Coffee } from "@/api/entities";
import { localCoffeeProducts, normaliseCoffeeProduct } from "@/data/coffeeProducts";

import HeroSection from "../components/home/HeroSection";
import IntroSection from "../components/home/IntroSection";
import ProductCarousel from "../components/home/ProductCarousel";
import PromiseSection from "../components/home/PromiseSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTABanner from "../components/home/CTABanner";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      // First try to get products with featured_rank
      let products = await Coffee.list('featured_rank', 10);
      if (!products?.length) {
        products = localCoffeeProducts;
      }

      products = products.map(normaliseCoffeeProduct);
      
      // Filter to only those with featured_rank and take first 3
      let featured = products
        .filter(p => p.featured_rank !== null && p.featured_rank !== undefined)
        .sort((a, b) => a.featured_rank - b.featured_rank)
        .slice(0, 3);
      
      // Fallback: if no featured_rank, get first 3 Blends
      if (featured.length === 0) {
        featured = products
          .filter(p => p.category === 'Blend')
          .slice(0, 3);
      }
      
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error loading products:', error);
      const featured = localCoffeeProducts
        .map(normaliseCoffeeProduct)
        .filter(p => p.featured_rank !== null && p.featured_rank !== undefined)
        .sort((a, b) => a.featured_rank - b.featured_rank)
        .slice(0, 3);
      setFeaturedProducts(featured);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <IntroSection />
      <ProductCarousel products={featuredProducts} loading={loading} />
      <PromiseSection />
      <TestimonialsSection />
      <CTABanner />
    </div>
  );
}
