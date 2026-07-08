import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Silvia",
    company: "La Fontana Café, Thames Ditton",
    content: "Since switching to The Roasting, our café has seen a noticeable increase in customer satisfaction. The rich flavour and aroma are unmatched – our clients keep coming back for more.",
    rating: 5
  },
  {
    name: "Tzesila",
    company: "Match My Coffee, East Molesey",
    content: "We've tried many suppliers, but none compares to The Roasting coffee. The depth of flavour and freshness make all the difference.",
    rating: 5
  },
  {
    name: "Luiza",
    company: "Kornetto Café, Stoneleigh",
    content: "From the first sip, you can tell this coffee is special. Our staff loves working with your beans, and our customers keep coming back for the quality.",
    rating: 5
  },
  {
    name: "Rebecca",
    company: "Signorelli, London",
    content: "The Roasting has been our trusted coffee supplier since the beginning of Signorelli in 2015. Excellent customer service, smooth logistics, one of our most valued suppliers!",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#201e20] relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=80"
        alt="Interior of a modern cafe"
        className="absolute inset-0 w-full h-full object-cover opacity-20 sepia"
        style={{ filter: 'sepia(60%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-2xl md:text-3xl font-semibold text-white mb-4 title-section drop-shadow-lg"
          >
            Trusted by Independent Cafés
          </h2>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <p 
              className="text-lg text-white font-medium"
            >
              See what our partners have to say about our coffee and service
            </p>
          </div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-black/40 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-white/20"
          >
            <div className="mb-8">
              <Quote className="w-12 h-12 text-[#ede8d0]/70 mx-auto mb-6" />
              <blockquote 
                className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-medium drop-shadow-md"
              >
                "{testimonials[activeTestimonial].content}"
              </blockquote>
            </div>

            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonials[activeTestimonial].rating
                      ? 'text-[#ede8d0] fill-[#ede8d0]'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
              <p 
                className="font-semibold text-white text-lg font-heading"
              >
                {testimonials[activeTestimonial].name}
              </p>
              <p 
                className="text-white/90 text-sm"
              >
                {testimonials[activeTestimonial].company}
              </p>
            </div>
          </motion.div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? 'bg-[#ede8d0] scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Client Logos */}
        <motion.div 
          className="mt-20 border-t border-white/20 pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block mx-auto">
            <p 
              className="text-center text-sm text-white"
            >
              Proudly serving independent cafés across the UK
            </p>
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-70 text-[#ede8d0] mt-8">
            <div className="font-bold text-lg font-heading drop-shadow-md">LA FONTANA CAFÉ</div>
            <div className="font-bold text-lg font-heading drop-shadow-md">MATCH MY COFFEE</div>
            <div className="font-bold text-lg font-heading drop-shadow-md">SIGNORELLI</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}