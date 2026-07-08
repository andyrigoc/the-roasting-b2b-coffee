import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Mountain } from "lucide-react";

function ScoreBar({ value, max = 10, label }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#201e20]/70">{label}</span>
        <span className="font-medium text-[#201e20]">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#704214]/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#704214] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function ProductCard({ product, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(product)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#704214]/10"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"}
          alt={product.commercial_name}
          className="w-full h-full object-cover"
          style={product.category === 'Blend' ? { filter: 'sepia(0.12) saturate(0.95) contrast(1.03) brightness(0.98)' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={`${product.category === 'Blend' ? 'bg-[#704214]' : 'bg-[#201e20]'} text-white text-xs`}>
            {product.category}
          </Badge>
        </div>
        {product.roast_agtron != null && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-[#201e20]">
            Agtron {product.roast_agtron}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Name & Location */}
        <div>
          <h3 className="title-card text-lg text-[#201e20] leading-tight">
            {product.commercial_name}
          </h3>
          <p className="text-sm text-[#201e20]/60 mt-1">
            {product.category === 'Blend' 
              ? product.region 
              : `${product.country}${product.region && product.region !== "n/a" ? ` · ${product.region}` : ""}`
            }
          </p>
        </div>

        {/* Variety */}
        <div className="text-sm text-[#201e20]/80">
          <span className="font-medium">{product.variety}</span>
          {product.sub_variety && product.sub_variety !== "n/a" && (
            <span className="text-[#201e20]/60"> · {product.sub_variety}</span>
          )}
        </div>

        {/* Altitude */}
        {product.altitude && product.altitude !== "n/a" && (
          <div className="flex items-center gap-1.5 text-sm text-[#201e20]/70">
            <Mountain className="w-3.5 h-3.5" />
            <span>{product.altitude}</span>
          </div>
        )}

        {/* Score Bars */}
        {(product.acidity != null || product.body != null) && (
          <div className="space-y-2 pt-2">
            {product.acidity != null && <ScoreBar value={product.acidity} label="Acidity" />}
            {product.body != null && <ScoreBar value={product.body} label="Body" />}
          </div>
        )}

        {/* Tasting Notes */}
        <p className="text-sm text-[#201e20]/70 italic line-clamp-2 pt-1 border-t border-[#704214]/10">
          {product.tasting_notes}
        </p>
      </div>
    </motion.div>
  );
}