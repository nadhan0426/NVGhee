import React, { useState } from 'react';
import { PRODUCTS, type Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { GheeJar3D } from './GheeJar3D';
import { X, CheckCircle, ShieldCheck, Flame, Droplets, Rotate3d, Image as ImageIcon } from 'lucide-react';

interface ProductSectionProps {
  onAddToCart: (product: Product, size: string, price: number) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onAddToCart }) => {
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalViewMode, setModalViewMode] = useState<'3d' | 'image'>('3d');

  return (
    <section id="products" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory-200/90 border border-ghee-gold/30 text-ghee-800 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
            Curated Artisanal Harvest
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-earth-900 font-normal tracking-tight uppercase mb-4">
            Pure Golden <span className="italic font-light text-ghee-700">Goodness</span>
          </h2>

          <p className="text-base sm:text-lg text-earth-800/80 font-light leading-relaxed">
            Traditionally crafted, naturally rich, and made to bring warmth to every meal.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => {
                setModalProduct(p);
                setModalViewMode('3d');
              }}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Quality Guarantee Ribbon */}
        <div className="mt-20 p-8 rounded-3xl glass-panel border border-ghee-gold/30 flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-ghee-600" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block">Lead-Free Glass Only</span>
              <span className="text-[11px] text-earth-800/60">Zero microplastics migration</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-ghee-600" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block">High Smoke Point 250°C</span>
              <span className="text-[11px] text-earth-800/60">Ideal for high heat searing</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6 text-ghee-600" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block">Naturally Lactose-Free</span>
              <span className="text-[11px] text-earth-800/60">Tested &lt;0.01% milk solids</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#FAF7EE] rounded-3xl p-6 sm:p-10 border border-ghee-gold/50 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-ivory-200 text-earth-900 hover:bg-ghee-300 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative flex flex-col items-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-ivory-100 border border-ghee-gold/30 relative">
                  {modalViewMode === '3d' ? (
                    <GheeJar3D />
                  ) : (
                    <img
                      src={modalProduct.image}
                      alt={modalProduct.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Toggle 3D vs Image */}
                <div className="mt-3 flex items-center gap-2 p-1 rounded-full bg-ivory-200 border border-ghee-gold/30">
                  <button
                    onClick={() => setModalViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      modalViewMode === '3d'
                        ? 'bg-earth-900 text-ivory-50 shadow-sm'
                        : 'text-earth-800 hover:text-earth-950'
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5 text-ghee-400" />
                    <span>360° 3D Model</span>
                  </button>
                  <button
                    onClick={() => setModalViewMode('image')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      modalViewMode === 'image'
                        ? 'bg-earth-900 text-ivory-50 shadow-sm'
                        : 'text-earth-800 hover:text-earth-950'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-ghee-400" />
                    <span>Still Photo</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ghee-700 bg-ghee-100 px-3 py-1 rounded-full border border-ghee-gold/30">
                  {modalProduct.badge}
                </span>

                <h3 className="font-serif text-3xl font-bold text-earth-900 mt-3 mb-1">
                  {modalProduct.name}
                </h3>
                <p className="text-xs uppercase tracking-widest text-ghee-800 font-semibold mb-4">
                  {modalProduct.tagline}
                </p>

                <p className="text-sm text-earth-800/85 leading-relaxed font-light mb-6">
                  {modalProduct.fullStory}
                </p>

                {/* Characteristics Box */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-ivory-100/90 border border-ghee-gold/20 mb-6 text-xs">
                  <div>
                    <span className="text-earth-800/50 block text-[10px] uppercase font-bold">Texture</span>
                    <span className="font-semibold text-earth-900">{modalProduct.characteristics.texture}</span>
                  </div>
                  <div>
                    <span className="text-earth-800/50 block text-[10px] uppercase font-bold">Aroma</span>
                    <span className="font-semibold text-earth-900">{modalProduct.characteristics.aroma}</span>
                  </div>
                  <div>
                    <span className="text-earth-800/50 block text-[10px] uppercase font-bold">Clarification</span>
                    <span className="font-semibold text-earth-900">{modalProduct.characteristics.method}</span>
                  </div>
                  <div>
                    <span className="text-earth-800/50 block text-[10px] uppercase font-bold">Smoke Point</span>
                    <span className="font-semibold text-earth-900">{modalProduct.characteristics.smokePoint}</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {modalProduct.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-earth-900">
                      <CheckCircle className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    const firstSize = modalProduct.sizes[0];
                    onAddToCart(modalProduct, firstSize.size, firstSize.price);
                    setModalProduct(null);
                  }}
                  className="w-full py-3 rounded-full bg-earth-900 text-ivory-50 text-xs font-semibold uppercase tracking-wider hover:bg-ghee-700 transition-colors shadow-md"
                >
                  Add To Pantry — From ${modalProduct.sizes[0].price.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
