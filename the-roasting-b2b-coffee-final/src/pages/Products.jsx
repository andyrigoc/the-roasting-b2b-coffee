import React, { useState, useEffect, useMemo } from "react";
import { Coffee } from "@/entities/Coffee";
import { motion } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeroBackground from "../components/shared/HeroBackground";
import { SITE_IMAGES } from "../components/shared/SiteImages";
import { localCoffeeProducts } from "@/data/coffeeProducts";

import ProductCard from "../components/products/ProductCard";
import ProductDetailModal from "../components/products/ProductDetailModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    try {
      const data = await Coffee.list('-created_date');
      setProducts(data?.length ? data : localCoffeeProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(localCoffeeProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (activeFilter !== "all") {
      filtered = filtered.filter(product => product.category === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.commercial_name?.toLowerCase().includes(term) ||
        product.country?.toLowerCase().includes(term) ||
        product.region?.toLowerCase().includes(term) ||
        product.tasting_notes?.toLowerCase().includes(term)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "country":
          return (a.country || "").localeCompare(b.country || "");
        case "acidity-desc":
          return (b.acidity || 0) - (a.acidity || 0);
        case "body-desc":
          return (b.body || 0) - (a.body || 0);
        case "roast-desc":
          return (b.roast_agtron || 0) - (a.roast_agtron || 0);
        case "name":
        default:
          return (a.commercial_name || "").localeCompare(b.commercial_name || "");
      }
    });

    return sorted;
  }, [products, searchTerm, activeFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#ede8d0]">
      {/* Hero Banner */}
      <HeroBackground
        src={SITE_IMAGES.productsHero}
        alt="Our coffee products"
        priority={true}
        className="h-[60vh]"
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-3xl md:text-6xl font-semibold mb-4 title-hero drop-shadow-lg">
              Our Coffee
            </h1>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
              <p className="text-xl md:text-2xl text-white font-medium">
                Exceptional blends and single origins
              </p>
            </div>
            <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 max-w-4xl mx-auto">
              <p className="text-base md:text-lg text-white/90">
                At The Roasting, each coffee starts with carefully selected green beans, stored by origin in dedicated silos and roasted in Milan using custom profiles for every mono-origin. Precision weighing, real-time temperature control and air cooling ensure that the blends and single origins you see here are consistent, repeatable and ready for busy cafés and restaurants.
              </p>
            </div>
          </div>
        </div>
      </HeroBackground>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="sticky top-[76px] z-30 bg-[#ede8d0]/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 rounded-b-lg">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                onClick={() => setActiveFilter("all")}
                className={`rounded-full ${activeFilter === "all" ? "bg-[#704214] hover:bg-[#201e20] text-white" : "text-[#201e20] hover:bg-[#704214]/10"}`}
              >
                All Coffee
              </Button>
              <Button
                variant={activeFilter === "Blend" ? "default" : "ghost"}
                onClick={() => setActiveFilter("Blend")}
                className={`rounded-full ${activeFilter === "Blend" ? "bg-[#704214] hover:bg-[#201e20] text-white" : "text-[#201e20] hover:bg-[#704214]/10"}`}
              >
                Blends
              </Button>
              <Button
                variant={activeFilter === "Monorigin" ? "default" : "ghost"}
                onClick={() => setActiveFilter("Monorigin")}
                className={`rounded-full ${activeFilter === "Monorigin" ? "bg-[#704214] hover:bg-[#201e20] text-white" : "text-[#201e20] hover:bg-[#704214]/10"}`}
              >
                Single Origins
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-white/80 rounded-full border-[#704214]/20">
                  <ArrowUpDown className="w-4 h-4 mr-2 text-[#201e20]/60" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A–Z</SelectItem>
                  <SelectItem value="country">Country A–Z</SelectItem>
                  <SelectItem value="acidity-desc">Acidity High→Low</SelectItem>
                  <SelectItem value="body-desc">Body High→Low</SelectItem>
                  <SelectItem value="roast-desc">Roast High→Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#201e20]/60 w-4 h-4" />
                <Input
                  placeholder="Search coffee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 rounded-full border-[#704214]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-[#201e20]/80">
            {loading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              `Showing ${filteredAndSortedProducts.length} ${filteredAndSortedProducts.length === 1 ? 'product' : 'products'}`
            )}
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#201e20]/60 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}
