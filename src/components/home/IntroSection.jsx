import React from "react";
import { motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section className="py-20 bg-[#ede8d0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p 
            className="text-xl md:text-2xl text-[#201e20] leading-relaxed font-body"
          >
            We roast in Milan in partnership with two of the oldest torrefazioni in the city, founded in 1947 and still operating in their original locations. From there, The Roasting supplies independent cafés across the UK with <span className="font-semibold text-[#704214]">reliable blends</span>,
            <span className="font-semibold text-[#704214]"> characterful single origins</span> and
            <span className="font-semibold text-[#201e20]"> straightforward service</span>.
            <br />
            <span className="text-[#704214] font-bold uppercase">Coffee that tastes good every day.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}