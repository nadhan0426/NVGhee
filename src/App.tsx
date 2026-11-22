import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { GheeExperience3D } from './components/GheeExperience3D';
import { ProductBenefitsSection } from './components/ProductBenefitsSection';
import { GheeProcessSection } from './components/GheeProcessSection';
import { ProductSection } from './components/ProductSection';
import { BrandStorySection } from './components/BrandStorySection';
import { Footer } from './components/Footer';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { LoadingScreen } from './components/LoadingScreen';
import type { Product } from './data/products';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // When loading completes, refresh ScrollTrigger geometry
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLoading]);

  // Add product to cart handler
  const handleAddToCart = (product: Product, size: string, price: number) => {
    const itemId = `${product.id}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: itemId, product, size, price, quantity: 1 }];
    });

    setToastMessage(`Added 1x ${product.name} (${size}) to reserve`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setToastMessage('🎉 Order simulated! Your artisanal ghee reserve has been scheduled.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-earth-900 selection:bg-ghee-300 selection:text-earth-950 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-earth-900 text-ivory-50 text-xs font-semibold tracking-wide shadow-2xl border border-ghee-gold/40 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-ghee-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Artisanal Preloader / Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Header & Sticky Navigation */}
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* SECTIONS 1, 2, 3: Unified Immersive 3D Experience (Hero Center -> Right Story 1 -> Left Story 2) */}
      <GheeExperience3D onModelLoaded={() => {}} />

      {/* SECTION 4A: Product Benefits & Living Nutrition */}
      <ProductBenefitsSection />

      {/* SECTION 4B: Sacred 5-Step Bilona Process Story */}
      <GheeProcessSection />

      {/* SECTION 4C: Pure Golden Goodness Product Showcase */}
      <ProductSection onAddToCart={handleAddToCart} />

      {/* SECTION 4D: Brand Story, Pasture Care & Heritage */}
      <BrandStorySection />

      {/* SECTION 4E: Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;
