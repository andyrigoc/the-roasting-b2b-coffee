import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mountain, Flame, Droplets, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ScoreBar({ value, max = 10, label }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-[#201e20]/70">{label}</span>
        <span className="font-semibold text-[#201e20]">{value}/{max}</span>
      </div>
      <div className="h-2 bg-[#704214]/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#704214] rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value || value === "n/a") return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#704214]/10 last:border-0">
      <Icon className="w-5 h-5 text-[#704214] mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-[#201e20]/60 uppercase tracking-wide">{label}</p>
        <p className="text-[#201e20] font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function ProductDetailModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#ede8d0] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-64 md:h-72">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"}
              alt={product.commercial_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-[#201e20]" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className={`${product.category === 'Blend' ? 'bg-[#704214]' : 'bg-[#201e20]'} text-white mb-3`}>
                {product.category}
              </Badge>
              <h2 className="title-hero text-2xl md:text-3xl text-white">
                {product.commercial_name}
              </h2>
              <p className="text-white/80 mt-1">
                {product.category === 'Blend' 
                  ? product.region 
                  : `${product.country}${product.region && product.region !== "n/a" ? ` · ${product.region}` : ""}`
                }
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-18rem)]">
            {["Zoagli", "Portofino", "Cinque Terre"].includes(product.commercial_name) && (
              <div className="bg-white/50 rounded-xl p-6 mb-8 space-y-3">
                <p className="text-sm text-[#201e20]/60 uppercase tracking-wide">Origin</p>
                <p className="text-[#201e20] font-medium">{product.region}</p>
                <p className="text-[#201e20] font-medium">{product.variety}</p>
                <div className="space-y-2 pt-3 border-t border-[#704214]/10">
                  {product.acidity != null && <ScoreBar value={product.acidity} label="Acidity" />}
                  {product.body != null && <ScoreBar value={product.body} label="Body" />}
                  {product.roast_agtron != null && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#201e20]/70">Roast (Agtron)</span>
                        <span className="font-semibold text-[#201e20]">{product.roast_agtron}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div className="space-y-1">
                <h3 className="title-card text-lg text-[#201e20] mb-4">
                  Origin Details
                </h3>
                
                <InfoRow icon={Coffee} label="Variety" value={product.variety} />
                {product.sub_variety && product.sub_variety !== "n/a" && (
                  <InfoRow icon={Coffee} label="Sub-Variety" value={product.sub_variety} />
                )}
                <InfoRow icon={Mountain} label="Altitude" value={product.altitude} />
                <InfoRow icon={Flame} label="Roast (Agtron)" value={product.roast_agtron} />
              </div>

              {/* Right Column - Scores & Tasting */}
              <div className="space-y-6">
                {(product.acidity != null || product.body != null) && (
                <div>
                  <h3 className="title-card text-lg text-[#201e20] mb-4">
                    Profile Scores
                  </h3>
                  <div className="space-y-4 bg-white/50 rounded-xl p-4">
                    {product.acidity != null && <ScoreBar value={product.acidity} label="Acidity" />}
                    {product.body != null && <ScoreBar value={product.body} label="Body" />}
                  </div>
                </div>
                )}

                <div>
                  <h3 className="font-heading text-lg font-bold text-[#201e20] mb-3">
                    Tasting Notes
                  </h3>
                  <p className="text-[#201e20]/80 leading-relaxed bg-white/50 rounded-xl p-4 italic">
                    {product.tasting_notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}