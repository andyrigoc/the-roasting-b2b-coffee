import React from "react";
import { motion } from "framer-motion";
import { Scale, Flame, Coffee } from "lucide-react";

const promises = [
  {
    icon: Scale,
    title: "Fair sourcing",
    description: "Direct relationships with farmers, ensuring quality and sustainability at every step of the supply chain."
  },
  {
    icon: Flame,
    title: "Slow, careful roasting",
    description: "Traditional Italian roasting methods, supported by modern roasting technology. We roast carefully calibrated batches and monitor temperature and time in real time, so each origin develops its full flavour without being rushed."
  },
  {
    icon: Coffee,
    title: "Coffee people come back for",
    description: "Consistent, repeatable quality backed by decades of roasting experience. From green bean selection to final roast, we follow every step so your customers get the same great cup, day after day."
  }
];

export default function PromiseSection() {
  return (
    <section className="py-20 bg-[#ede8d0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-2xl md:text-3xl font-semibold text-[#201e20] mb-4 title-section"
          >
            Our Promise to You
          </h2>
          <p 
            className="text-lg text-[#201e20]/80 max-w-2xl mx-auto"
          >
            Three pillars that define everything we do, from bean to cup
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <promise.icon className="w-10 h-10 text-[#704214]" />
                </div>
                {/* Decorative background circle */}
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-[#704214]/5 rounded-full -z-10 group-hover:bg-[#704214]/10 transition-colors duration-300" />
              </div>
              <h3 
                className="text-lg font-semibold text-[#201e20] mb-4 group-hover:text-[#704214] transition-colors duration-300 title-card"
              >
                {promise.title}
              </h3>
              <p 
                className="text-[#201e20]/80 leading-relaxed"
              >
                {promise.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}