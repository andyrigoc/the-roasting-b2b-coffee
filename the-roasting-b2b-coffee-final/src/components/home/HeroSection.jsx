import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroBackground from "../shared/HeroBackground";
import { SITE_IMAGES } from "../shared/SiteImages";

export default function HeroSection() {
  return (
    <HeroBackground
      src={SITE_IMAGES.homeHero}
      alt="The Roasting coffee roaster"
      priority={true}
      className="h-screen"
    >
      <div className="h-full flex flex-col justify-center items-center text-center text-white px-6">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6">
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight title-hero drop-shadow-lg"
            >
              Heritage roasting,{" "}
              <span className="text-[#FFE6A7]">modern café service.</span>
            </h1>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-4 inline-block">
              <p 
                className="text-xl md:text-2xl text-white leading-relaxed max-w-2xl mx-auto font-medium"
              >
                Smooth, dependable coffee designed for busy, quality-focused teams.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={createPageUrl("Connect")}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-white rounded-full hover:bg-transparent hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Request a Sample
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              to={createPageUrl("OurStory")}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white hover:text-gray-200 transition-colors duration-300"
            >
              Our Story
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            className="inline-flex items-center gap-3 text-sm text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-2 h-2 bg-[#FFE6A7] rounded-full"></div>
            <span className="text-[#FFE6A7]">Roasting in Italy since 1947</span>
            <div className="w-2 h-2 bg-[#FFE6A7] rounded-full"></div>
            <span className="text-[#FFE6A7]">from Milan to London</span>
          </motion.div>
        </motion.div>
      </div>
    </HeroBackground>
  );
}