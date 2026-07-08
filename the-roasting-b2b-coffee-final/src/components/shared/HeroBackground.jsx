import React from "react";

export default function HeroBackground({ 
  src, 
  alt, 
  priority = false, 
  overlayStrength = 0.4,
  children,
  className = "h-screen"
}) {
  return (
    <section className={`relative ${className} bg-black overflow-hidden`}>
      <div className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="w-full h-full object-cover"
          style={{ 
            position: 'absolute', 
            inset: 0,
            filter: 'sepia(0.12) saturate(0.95) contrast(1.03) brightness(0.98)'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/35"
        />
      </div>
      <div className="relative h-full">
        {children}
      </div>
    </section>
  );
}