import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, MapPin, Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);
  
  const navigation = [
    { name: "Home", href: createPageUrl("Home") },
    { name: "Our Story", href: createPageUrl("OurStory") },
    { name: "Our Coffee", href: createPageUrl("Products") }
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-2.5 sm:py-3">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="relative z-50 inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#704214]"
              aria-label="The Roasting — Home"
            >
              <img
                src="/Logo.png"
                alt="The Roasting, Tradizione Italiana"
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
            </Link>

            {/* Desktop Navigation */}
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
            <button
              className="md:hidden relative z-50 p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#201e20]" />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-300 ${scrolled ? 'text-[#201e20]' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 pt-20 pb-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl font-semibold font-title transition-colors duration-200 ${
                isActivePage(item.href)
                  ? 'text-[#704214]'
                  : 'text-[#201e20] hover:text-[#704214]'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to={createPageUrl("PhotoGallery")}
            onClick={() => setMobileMenuOpen(false)}
            className={`text-2xl font-semibold font-title transition-colors duration-200 ${
              location.pathname === '/PhotoGallery'
                ? 'text-[#704214]'
                : 'text-[#201e20] hover:text-[#704214]'
            }`}
          >
            Photo Gallery
          </Link>
          <div className="mt-4 pt-4 border-t border-gray-200 w-48 text-center">
            <Link
              to={createPageUrl("Connect")}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block bg-[#704214] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#201e20] transition-all duration-200"
            >
              Request Sample
            </Link>
          </div>
        </div>
      </div>

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
                <Link
                  to={createPageUrl("Home")}
                  className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  aria-label="The Roasting — Home"
                >
                  <img
                    src="/Logo.png"
                    alt="The Roasting, Tradizione Italiana"
                    className="h-32 w-32 object-contain"
                  />
                </Link>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Authentic coffee from Milan for independent cafés and restaurants across the UK.
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
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Red Lion Road<br />Surbiton, KT6<br />UK</span>
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
