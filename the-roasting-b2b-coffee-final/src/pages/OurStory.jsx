import React from "react";
import { motion } from "framer-motion";
import { Award, Users, Leaf, FileCheck } from "lucide-react";
import HeroBackground from "../components/shared/HeroBackground";
import { SITE_IMAGES } from "../components/shared/SiteImages";

export default function OurStoryPage() {
  const philosophyItems = [
    {
      title: "Small batch roasting",
      description: "We roast in carefully measured batches, typically around 120kg at a time, rather than pushing capacity to the limit. Each origin is stored in its own silo and weighed on precision scales before roasting, so we can repeat the same profile with consistency from batch to batch.",
      image: SITE_IMAGES.ourStorySmallBatch
    },
    {
      title: "Air cooling method",
      description: "Once the beans hit their ideal roast, they are released into rotating cooling pans where air flows underneath to stop the roast at exactly the right moment. This air cooling preserves the coffee's natural oils and keeps the flavours clean and bright in the cup.",
      image: SITE_IMAGES.ourStoryAirCooling
    },
    {
      title: "Balanced profiles",
      description: "Each mono-origin has its own roasting curve: temperature, timing and development are tuned to that specific coffee. Advanced sensors and monitoring devices allow the roaster to adjust in real time, creating balanced profiles that highlight origin character without tipping into harsh acidity or flat bitterness.",
      image: SITE_IMAGES.ourStoryBalancedProfiles
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <HeroBackground
        src={SITE_IMAGES.ourStoryHero}
        alt="Our Story - The Roasting heritage"
        priority={true}
        className="h-[80vh]"
      >
        <div className="h-full flex items-center justify-center">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-6xl font-semibold mb-4 title-hero drop-shadow-lg">
              From Milan, 1947
            </h1>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
              <p className="text-xl md:text-2xl text-white font-medium">
                Three generations of coffee expertise
              </p>
            </div>
          </motion.div>
        </div>
      </HeroBackground>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Founder's Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 title-section">
                A family tradition
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Since 1947, two family-run torrefazioni in Milan's Navigli district have specialised in espresso—the Italian coffee par excellence—roasting for local bars and cafés and tailoring blends to the tastes of the city. Their history and know-how sit at the heart of The Roasting's coffee today.
                </p>
                <p>
                  Over the decades, the original artisanal production has evolved with sophisticated systems and state-of-the-art roasting machines. What hasn't changed is the character of the coffee: the roasting style has remained deliberately hands-on, preserving the aroma and taste that made these torrefazioni recognisable well beyond Milan.
                </p>
                <p>
                  In the late 1990s the two roasteries joined forces. Today they are among the oldest torrefazioni still operating in their original Milan locations. The Roasting works closely with them to bring that heritage, and a modern, innovation-led approach to roasting, to independent cafés and restaurants across the UK.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={SITE_IMAGES.ourStoryFamilyTradition}
                alt="Family tradition - hands holding coffee beans"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl shadow-lg max-w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#622700]/20 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 title-section">
              Our roasting philosophy
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Traditional methods, modern understanding, and an unwavering commitment to quality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {philosophyItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 title-card">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Why we are different */}
          <motion.div
            className="mt-16 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 title-card">
              Why we are different
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our recipes are the result of passion, tradition and modern science. We follow each coffee from green bean to finished roast, tailoring profiles to our customers' needs and adjusting every batch in real time. That combination of long-standing Milanese roasting heritage and innovation is what makes our coffee—and our service—genuinely different.
            </p>
          </motion.div>
        </section>

        {/* Certifications */}
        <section>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 title-section">
              Our commitments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All our coffees are delivered with certification and traceability documents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileCheck,
                title: "Full Traceability",
                description: "Complete documentation and certification for every batch, ensuring transparency from origin to cup."
              },
              {
                icon: Leaf,
                title: "Organic Certified",
                description: "Many of our single origins are certified organic, supporting sustainable farming practices."
              },
              {
                icon: Users,
                title: "Fairtrade Partnership",
                description: "We work directly with farmers through Fairtrade certified cooperatives for ethical sourcing."
              },
              {
                icon: Award,
                title: "Rainforest Alliance",
                description: "Supporting biodiversity and sustainable livelihoods in coffee-growing communities."
              }
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/50 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center border border-white/30"
              >
                <div className="w-16 h-16 bg-[#622700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <cert.icon className="w-8 h-8 text-[#622700]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 title-card">
                  {cert.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}