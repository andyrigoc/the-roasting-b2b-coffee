import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, MapPin } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navigation = [
    { name: "Home", href: createPageUrl("Home") },
    { name: "Our Story", href: createPageUrl("OurStory") },
    { name: "Products", href: createPageUrl("Products") }
  ];

  const isActivePage = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap');

        .font-heading {
          font-family: 'Montserrat', sans-serif;
        }
        .font-body {
          font-family: 'Manrope', sans-serif;
        }
        body {
          font-family: 'Manrope', sans-serif;
        }
        h1, h2, h3, h4, h5, h6, .font-title {
          font-family: 'Montserrat', sans-serif;
        }
        .title-hero {
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 600;
        }
        .title-section {
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
        }
        .title-card {
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.06em;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .title-hero {
            letter-spacing: 0.08em;
          }
          .title-section {
            letter-spacing: 0.06em;
          }
        }
      `}</style>

      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className={`font-title text-2xl font-bold transition-colors duration-300 ${scrolled ? 'text-[#201e20]' : 'text-white'}`}>
              The Roasting
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActivePage(item.href)
                      ? 'text-[#704214] border-b-2 border-[#704214] pb-1'
                      : scrolled ? 'text-[#201e20] hover:text-[#704214]' : 'text-white hover:text-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to={createPageUrl("Connect")}
                className="bg-[#704214] text-white px-6 py-2 rounded-full font-medium hover:bg-[#201e20] transition-all duration-200 transform hover:scale-105"
              >
                Request Sample
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link
                to={createPageUrl("Connect")}
                className="bg-[#704214] text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Sample
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#201e20] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                 <span className="font-title text-2xl font-bold">The Roasting</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Well-roasted coffee from Milan to the UK. Serving independent cafés and restaurants since 1947.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 font-title">
                Contact Us
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@theroastingltd.co.uk" className="hover:text-white transition-colors">info@theroastingltd.co.uk</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>London, UK</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 font-title">
                Quick Links
              </h4>
              <div className="space-y-2 text-sm">
                <div><Link to={createPageUrl("Products")} className="hover:text-gray-300 transition-colors">Our Coffee</Link></div>
                <div><Link to={createPageUrl("Connect")} className="hover:text-gray-300 transition-colors">Request Sample</Link></div>
                <div><Link to={createPageUrl("OurStory")} className="hover:text-gray-300 transition-colors">Our Story</Link></div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 The Roasting. Crafting exceptional coffee since 1947.</p>
            <p className="mt-2">The Roasting Tradizione Italiana LTD · Company registered number: 16942316</p>
          </div>
        </div>
      </footer>
    </div>
  );
}