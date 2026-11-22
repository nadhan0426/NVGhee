import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);
      setIsPastHero(y > 2500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          isPastHero
            ? isScrolled
              ? 'py-3.5 bg-[#FDFCF7]/90 backdrop-blur-md border-b border-ghee-gold/30 shadow-sm text-earth-900'
              : 'py-4 bg-[#FDFCF7]/60 backdrop-blur-sm border-b border-ghee-gold/15 text-earth-900'
            : isScrolled
            ? 'py-3.5 bg-[#14251B]/85 backdrop-blur-md border-b border-[#D9AE45]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-[#F8F0DF]'
            : 'py-4 bg-[#14251B]/40 backdrop-blur-sm border-b border-[#D9AE45]/15 text-[#F8F0DF]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-black text-sm shadow-sm group-hover:scale-105 transition-transform ${
                isPastHero
                  ? 'bg-gradient-to-tr from-ghee-600 via-ghee-400 to-ghee-200 text-earth-950'
                  : 'bg-gradient-to-tr from-[#D9AE45] via-[#ecd58e] to-[#FFF0D4] text-[#14251B]'
              }`}
            >
              NV
            </div>
            <div>
              <span
                className={`font-serif text-xl sm:text-2xl font-bold tracking-tight block leading-none transition-colors ${
                  isPastHero ? 'text-earth-900' : 'text-[#F8F0DF]'
                }`}
              >
                GHEE
              </span>
              <span
                className={`text-[9px] uppercase tracking-[0.25em] font-semibold block transition-colors ${
                  isPastHero ? 'text-ghee-700' : 'text-[#D9AE45]'
                }`}
              >
                100% Vedic Organic
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium transition-colors ${
              isPastHero ? 'text-earth-800' : 'text-[#F8F0DF]/85'
            }`}
          >
            <a
              href="#experience"
              className={`transition-colors ${
                isPastHero ? 'hover:text-ghee-700' : 'hover:text-[#D9AE45]'
              }`}
            >
              The Jar Experience
            </a>
            <a
              href="#benefits"
              className={`transition-colors ${
                isPastHero ? 'hover:text-ghee-700' : 'hover:text-[#D9AE45]'
              }`}
            >
              Purity & Benefits
            </a>
            <a
              href="#story"
              className={`transition-colors ${
                isPastHero ? 'hover:text-ghee-700' : 'hover:text-[#D9AE45]'
              }`}
            >
              The Bilona Craft
            </a>
            <a
              href="#products"
              className={`transition-colors ${
                isPastHero ? 'hover:text-ghee-700' : 'hover:text-[#D9AE45]'
              }`}
            >
              Reserve Collection
            </a>
            <a
              href="#heritage"
              className={`transition-colors ${
                isPastHero ? 'hover:text-ghee-700' : 'hover:text-[#D9AE45]'
              }`}
            >
              Brand Story
            </a>
          </nav>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Ambient Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full border transition-colors ${
                isPastHero
                  ? 'border-ghee-gold/30 text-earth-800/80 hover:bg-ivory-200'
                  : 'border-[#D9AE45]/35 text-[#F8F0DF]/85 hover:bg-[#1A2E22]'
              }`}
              title={soundEnabled ? 'Mute ambient' : 'Ambient sound'}
            >
              {soundEnabled ? (
                <Volume2
                  className={`w-4 h-4 animate-pulse ${
                    isPastHero ? 'text-ghee-600' : 'text-[#D9AE45]'
                  }`}
                />
              ) : (
                <VolumeX
                  className={`w-4 h-4 ${
                    isPastHero ? 'text-earth-800/40' : 'text-[#F8F0DF]/40'
                  }`}
                />
              )}
            </button>

            {/* Cart Button: Elegant Gold Primary Button */}
            <button
              onClick={onOpenCart}
              className={`relative px-3 py-2 sm:px-3.5 sm:py-2 rounded-full transition-all duration-300 shadow-md flex items-center gap-2 font-semibold text-xs ${
                isPastHero
                  ? 'bg-earth-900 text-ivory-50 hover:bg-ghee-700'
                  : 'bg-[#D9AE45] hover:bg-[#c99e38] text-[#14251B]'
              }`}
            >
              <ShoppingBag
                className={`w-4 h-4 ${isPastHero ? 'text-ghee-300' : 'text-[#14251B]'}`}
              />
              <span
                className={`text-xs font-bold px-1.5 py-0.2 rounded-full text-[10px] ${
                  isPastHero
                    ? 'bg-ghee-500 text-earth-950'
                    : 'bg-[#14251B] text-[#D9AE45]'
                }`}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isPastHero
                  ? 'text-earth-900 hover:bg-ivory-200'
                  : 'text-[#F8F0DF] hover:bg-[#1A2E22]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-30 flex flex-col justify-center items-center gap-6 text-center text-lg font-serif animate-in fade-in duration-200 md:hidden ${
            isPastHero ? 'bg-[#FAF7EE] text-earth-900' : 'bg-[#14251B] text-[#F8F0DF]'
          }`}
        >
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[#D9AE45]"
          >
            The 3D Jar Experience
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[#D9AE45]"
          >
            Purity & Benefits
          </a>
          <a
            href="#story"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[#D9AE45]"
          >
            The Bilona Craft
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[#D9AE45]"
          >
            Reserve Collection
          </a>
          <a
            href="#heritage"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[#D9AE45]"
          >
            Brand Story & Heritage
          </a>
        </div>
      )}
    </>
  );
};
