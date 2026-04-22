import { Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { QuantityStepper } from "@/ui/shared/QuantityStepper";
import { useCartStore } from "@/ui/state/cartStore";
import type { Product } from "@/ui/state/types";

export function ProductCard({ product }: { product: Product }) {
  const nav = useNavigate();
  const addProduct = useCartStore((s) => s.addProduct);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const getItemQty = useCartStore((s) => s.getItemQty);
  const items = useCartStore((s) => s.items);

  const sizes = product.attributes?.size as string[] | undefined;
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    Array.isArray(sizes) && sizes.length > 0 ? sizes[0] : undefined
  );

  const qty = getItemQty(product.id, product.sellerId, selectedSize);

  const getItemId = (productId: string, sellerId: string, variantId?: string) =>
    items.find(
      (i) =>
        i.productId === productId &&
        i.sellerId === sellerId &&
        i.variantId === variantId
    )?.id;

  const handleIncrease = () => {
    const itemId = getItemId(product.id, product.sellerId, selectedSize);
    if (itemId) {
      increase(itemId);
    } else {
      addProduct(product, selectedSize);
    }
  };

  const handleDecrease = () => {
    const itemId = getItemId(product.id, product.sellerId, selectedSize);
    if (itemId) {
      decrease(itemId);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 text-left flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden mb-3 relative">
        <button
          onClick={() => nav(`/product/${product.id}`)}
          className="w-full h-full"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain p-2"
          />
        </button>
        {product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            {product.badge}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <button
          onClick={() => nav(`/product/${product.id}`)}
          className="text-left"
        >
          <p className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] mb-1 leading-tight">
            {product.title}
          </p>
        </button>

        <div className="flex items-center gap-1 mb-2">
          <Star
            size={12}
            className="fill-yellow-400 text-yellow-400"
          />
          <span className="text-xs font-bold text-gray-700">
            {product.rating || "5.0"}
          </span>
          <button
            onClick={() => nav(`/product/${product.id}/reviews`)}
            className="text-[10px] text-gray-400 hover:text-[var(--fresh-green)] underline underline-offset-2"
          >
            {product.reviewsCount || 0} отзывов
          </button>
        </div>

        {Array.isArray(sizes) && sizes.length > 1 && (
          <div className="mb-3">
            <p className="text-[10px] text-gray-400 mb-1.5 uppercase font-bold tracking-wider">
              Размер
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedSize === s
                      ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)] shadow-sm"
                      : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-2">{product.unitLabel}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none">
                {product.price} ₽
              </span>
              {product.oldPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {product.oldPrice} ₽
                </span>
              )}
            </div>
            <QuantityStepper
              value={qty}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
