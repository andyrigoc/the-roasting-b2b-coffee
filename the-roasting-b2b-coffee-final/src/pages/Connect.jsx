import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBackground from "../components/shared/HeroBackground";
import { SITE_IMAGES } from "../components/shared/SiteImages";

import SampleRequestForm from "../components/connect/SampleRequestForm";

export default function ConnectPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen">
        <HeroBackground
          src={SITE_IMAGES.confirmationBg}
          alt="Sample request confirmation"
          priority={true}
          className="min-h-screen"
          overlayStrength={0.5}
        >
          <div className="h-full flex items-center justify-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl p-10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#704214]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#704214]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#201e20] mb-4 title-section">
                Thank you for your request!
              </h2>
              <p className="text-lg text-[#201e20]/70 mb-8">
                We'll be in touch within 24 hours to arrange your free sample delivery. 
                Looking forward to working with you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Products")}>
                  <Button className="bg-[#704214] hover:bg-[#201e20] text-white rounded-full px-6 py-3">
                    <Coffee className="w-4 h-4 mr-2" />
                    Explore Our Coffee
                  </Button>
                </Link>
                <Link to={createPageUrl("Home")}>
                  <Button variant="outline" className="rounded-full px-6 py-3 border-[#704214] text-[#704214] hover:bg-[#704214]/10">
                    Back to Home
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </HeroBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <HeroBackground
        src={SITE_IMAGES.connectHero}
        alt="Let's talk coffee"
        priority={true}
        className="h-[60vh]"
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-3xl md:text-6xl font-semibold mb-4 title-hero drop-shadow-lg">
              Let's talk coffee
            </h1>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
              <p className="text-xl md:text-2xl text-white font-medium">
                Start your journey with a free sample
              </p>
            </div>
            <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-white/90">
                We'll match your café or restaurant with coffees roasted in Milan at two of the city's longest-standing torrefazioni, blending more than 75 years of roasting experience with modern technology to support your coffee programme.
              </p>
            </div>
          </div>
        </div>
      </HeroBackground>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 -mt-24 relative z-10">
        <SampleRequestForm onSubmitted={() => setSubmitted(true)} />
      </div>
    </div>
  );
}