import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ProductCarousel({ products, loading }) {
  // Don't render if no products and not loading
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 title-section">
              Featured Coffee
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most popular blends and single origins
            </p>
          </div>
          <Link 
            to={createPageUrl("Products")}
            className="hidden md:inline-flex items-center text-[#704214] hover:text-[#201e20] font-medium transition-colors duration-200"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Link to={createPageUrl("Products")} className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"}
                        alt={product.commercial_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${product.category === 'Blend' ? 'bg-[#704214]' : 'bg-[#201e20]'} text-white`}>
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#704214] transition-colors duration-200 title-card">
                        {product.commercial_name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {product.category === 'Blend' 
                          ? product.region 
                          : `${product.country}${product.region && product.region !== "n/a" ? ` · ${product.region}` : ""}`
                        }
                      </p>
                      {product.tasting_notes && (
                        <p className="text-sm text-gray-600 italic line-clamp-2 mb-4">
                          {product.tasting_notes}
                        </p>
                      )}
                      <span className="inline-flex items-center text-sm font-medium text-[#704214] group-hover:text-[#201e20] transition-colors">
                        View product
                        <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link 
            to={createPageUrl("Products")}
            className="inline-flex items-center text-[#704214] hover:text-[#201e20] font-medium transition-colors duration-200"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}