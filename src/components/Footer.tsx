import React, { useState } from 'react';
import { Mail, ArrowRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative w-full bg-[#1A1612] text-[#EDE4CD] pt-24 pb-12 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      {/* Decorative flowing gold top gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ghee-500 to-transparent opacity-60" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-ghee-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Newsletter & Brand statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-ivory-300/10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                NV GHEE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-ghee-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-ghee-400 font-semibold">
                Pure Organic Reserve
              </span>
            </div>

            <p className="max-w-md text-sm text-[#CBB782]/80 font-light leading-relaxed mb-6">
              Born from Vedic pastoral traditions and hand-churned with two-way wooden bilonas. 
              We bottle living warmth, golden memories, and authentic kitchen heritage.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#DECFA9]/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-ghee-400" /> Lead-Free Glass Jars
              </span>
              <span>•</span>
              <span>A2 Gir Pasture Milk</span>
              <span>•</span>
              <span>Batch Numbered</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h4 className="font-serif text-2xl font-normal text-white mb-2">
              Receive The Seasonal Harvest Monograph
            </h4>
            <p className="text-xs text-[#CBB782]/70 font-light mb-5">
              Occasional culinary pairings, Vedic recipes, and priority access to limited seasonal Bilona batches.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-ghee-900/40 border border-ghee-500/40 text-ghee-300 text-xs flex items-center gap-2">
                <span>✨</span>
                <span>Thank you for joining our heritage circle. Your welcome monograph is on its way.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBB782]/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-[#CBB782]/40 text-xs focus:outline-none focus:border-ghee-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-ghee-500 to-ghee-600 text-earth-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-ivory-300/10 text-xs font-light">
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-[#CBB782]/80">
              <li><a href="#hero" className="hover:text-ghee-300 transition-colors">Home & 3D Jar</a></li>
              <li><a href="#story" className="hover:text-ghee-300 transition-colors">Our Story & Craft</a></li>
              <li><a href="#story" className="hover:text-ghee-300 transition-colors">From Seed To Bottle</a></li>
              <li><a href="#products" className="hover:text-ghee-300 transition-colors">Pure Golden Products</a></li>
              <li><a href="#quality" className="hover:text-ghee-300 transition-colors">Quality Standards</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Reserve Collection
            </h5>
            <ul className="space-y-2.5 text-[#CBB782]/80">
              <li><a href="#products" className="hover:text-ghee-300 transition-colors">Organic Cow Ghee</a></li>
              <li><a href="#products" className="hover:text-ghee-300 transition-colors">Traditional Bilona Ghee</a></li>
              <li><a href="#products" className="hover:text-ghee-300 transition-colors">Premium Desi Ghee</a></li>
              <li><a href="#products" className="hover:text-ghee-300 transition-colors">Family Harvest Pack</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Sanctuary
            </h5>
            <ul className="space-y-2.5 text-[#CBB782]/80">
              <li>Estate Farm: Gir Valley Pastures</li>
              <li>concierge@nvghee.com</li>
              <li>+1 (800) 443-3443</li>
              <li>Mon – Fri: 9:00 AM – 6:00 PM</li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Heritage Fellowship
            </h5>
            <p className="text-[#CBB782]/70 text-[11px] mb-4">
              Follow our daily morning rituals and pastoral updates across our journals.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-ghee-500 hover:text-earth-950 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-ghee-500 hover:text-earth-950 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-ghee-500 hover:text-earth-950 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#CBB782]/50">
          <p>© {new Date().getFullYear()} NV Ghee Reserve. Handcrafted with devotion. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Laboratory Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
