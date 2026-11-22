import React, { useState } from 'react';
import type { Product } from '../data/products';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, price: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(() => {
    const popularIdx = product.sizes.findIndex((s) => s.isPopular);
    return popularIdx !== -1 ? popularIdx : 0;
  });

  const [isAdded, setIsAdded] = useState(false);

  const selectedSize = product.sizes[selectedSizeIndex];

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCart(product, selectedSize.size, selectedSize.price);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group relative bg-[#FAF7EE] rounded-3xl p-5 sm:p-6 border border-ghee-gold/30 shadow-luxury hover:shadow-2xl hover:border-ghee-gold/60 transition-all duration-500 flex flex-col justify-between">
      {/* Top Badge & Rating */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-ivory-200/80 text-ghee-800 border border-ghee-gold/30">
            {product.badge}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-earth-900">
            <Star className="w-3.5 h-3.5 fill-ghee-500 text-ghee-500" />
            <span>{product.rating}</span>
            <span className="text-earth-800/40 font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Image Container */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-ivory-100 mb-6 group-hover:scale-[1.02] transition-transform duration-500">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Quick View Floating Button on Hover */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-ivory-50/90 text-earth-900 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-ghee-500 hover:text-white"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Info */}
        <h3 className="font-serif text-2xl font-bold text-earth-900 mb-1">
          {product.name}
        </h3>
        <p className="text-xs uppercase tracking-wider text-ghee-700 font-semibold mb-3">
          {product.tagline}
        </p>
        <p className="text-xs text-earth-800/80 leading-relaxed font-light line-clamp-2 mb-5">
          {product.description}
        </p>

        {/* Size Selection Pill Buttons */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-earth-800/60 block mb-2">
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s, idx) => (
              <button
                key={s.size}
                onClick={() => setSelectedSizeIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  idx === selectedSizeIndex
                    ? 'bg-earth-900 text-ivory-50 shadow-sm'
                    : 'bg-ivory-100 text-earth-800 border border-ghee-gold/30 hover:border-ghee-gold'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="pt-4 border-t border-ghee-gold/20 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-earth-800/50 uppercase tracking-wider block">Price</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-earth-900">
              ${selectedSize.price.toFixed(2)}
            </span>
            {selectedSize.originalPrice && (
              <span className="text-xs text-earth-800/40 line-through">
                ${selectedSize.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm ${
            isAdded
              ? 'bg-sage-600 text-white'
              : 'bg-earth-900 text-ivory-50 hover:bg-ghee-700 hover:shadow-md'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-ghee-400" />
              <span>Shop Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
