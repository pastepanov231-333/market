import { Star, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QuantityStepper } from "@/ui/shared/QuantityStepper";
import { useCartStore } from "@/ui/state/cartStore";
import type { Product } from "@/ui/state/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const nav = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.attributes?.size?.[0] || null
  );
  const [showSizeTable, setShowSizeTable] = useState(false);

  const addProduct = useCartStore((s) => s.addProduct);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const getItemQty = useCartStore((s) => s.getItemQty);
  const items = useCartStore((s) => s.items);

  const variantId = selectedSize ?? undefined;
  const qty = getItemQty(product.id, product.sellerId, variantId);
  const cartItem = items.find(
    (i) =>
      i.productId === product.id &&
      i.sellerId === product.sellerId &&
      i.variantId === variantId
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 text-left flex flex-col h-full shadow-sm">
      <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden mb-3 relative group">
        <button
          onClick={() => nav(`/product/${product.id}`)}
          className="w-full h-full"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2 group">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{product.rating || 4.8}</span>
          <button
            onClick={() => nav(`/product/${product.id}/reviews`)}
            className="text-xs text-gray-400 hover:text-[var(--fresh-green)] underline underline-offset-2 decoration-gray-200 transition-colors"
          >
            {product.reviewsCount || 0} отзывов
          </button>
        </div>

        <p className="text-sm text-gray-900 line-clamp-2 min-h-[40px] mb-1 font-medium leading-snug">
          {product.title}
        </p>
        <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-wider font-bold">
          {product.unitLabel}
        </p>

        {product.attributes?.size && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Размер</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeTable(true);
                }}
                className="text-[10px] font-bold text-[var(--fresh-green)] uppercase tracking-wider hover:underline"
              >
                Размерная сетка
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(product.attributes.size) && product.attributes.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(String(size))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    selectedSize === String(size)
                      ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)] shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                {product.oldPrice} ₽
              </span>
            )}
            <span className="font-bold text-base text-gray-900">{product.price} ₽</span>
          </div>
          <QuantityStepper
            value={qty}
            compact
            onIncrease={() => {
              if (cartItem) increase(cartItem.id);
              else addProduct(product, variantId);
            }}
            onDecrease={() => {
              if (cartItem) decrease(cartItem.id);
            }}
          />
        </div>
      </div>

      {showSizeTable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSizeTable(false)} />
          <div className="relative bg-white w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Размерная сетка</h3>
              <button onClick={() => setShowSizeTable(false)} className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                    <th className="text-left pb-3 font-bold">Размер</th>
                    <th className="text-center pb-3 font-bold">Обхват (см)</th>
                    <th className="text-right pb-3 font-bold">Рост (см)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900">
                  {[
                    { s: "S", b: "88-92", h: "164-170" },
                    { s: "M", b: "96-100", h: "170-176" },
                    { s: "L", b: "104-108", h: "176-182" },
                    { s: "XL", b: "112-116", h: "182-188" },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-2.5 font-bold">{row.s}</td>
                      <td className="py-2.5 text-center text-gray-600">{row.b}</td>
                      <td className="py-2.5 text-right text-gray-600">{row.h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => setShowSizeTable(false)}
                className="w-full mt-6 py-3 bg-[var(--fresh-green)] text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
