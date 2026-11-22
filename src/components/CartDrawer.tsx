import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 6.5;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-earth-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7EE] shadow-2xl flex flex-col justify-between border-l border-ghee-gold/40">
          {/* Header */}
          <div className="p-6 border-b border-ghee-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ghee-700" />
              <h3 className="font-serif text-xl font-bold text-earth-900">Your Reserve Cart</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-ivory-200 text-earth-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-earth-800/60">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-ghee-gold/40" />
                <p className="font-serif text-lg text-earth-900 font-medium">Your pantry is empty</p>
                <p className="text-xs font-light mt-1">Discover our authentic Vedic ghee collection.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl glass-panel border border-ghee-gold/30 flex gap-4 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-ivory-100 border border-ghee-gold/20"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif text-sm font-bold text-earth-900">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-ghee-700 font-semibold uppercase tracking-wider block">
                      Size: {item.size}
                    </span>
                    <span className="text-xs font-serif font-bold text-earth-900 block mt-1">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-earth-800/40 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 bg-ivory-100 rounded-full border border-ghee-gold/30 px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-earth-900 hover:text-ghee-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-earth-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-earth-900 hover:text-ghee-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-ghee-gold/30 bg-ivory-100/80 space-y-3">
              <div className="flex justify-between text-xs text-earth-800">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-earth-800">
                <span>Vedic Insulated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-ghee-gold/20 flex justify-between font-serif text-lg font-bold text-earth-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full mt-4 py-3.5 rounded-full bg-earth-900 hover:bg-ghee-700 text-ivory-50 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-ghee-400" />
              </button>

              <p className="text-[10px] text-center text-earth-800/50">
                Protected by 256-bit encryption • Direct from estate farm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
