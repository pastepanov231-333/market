import { Heart, Share2, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "@/ui/shared/Header";
import { QuantityStepper } from "@/ui/shared/QuantityStepper";
import { useCartStore } from "@/ui/state/cartStore";
import { products, sellers } from "@/ui/state/mock";

export function ProductDetails() {
  const nav = useNavigate();
  const { id } = useParams();
  const [favorite, setFavorite] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const addProduct = useCartStore((s) => s.addProduct);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const getItemQty = useCartStore((s) => s.getItemQty);
  const items = useCartStore((s) => s.items);

  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const seller = useMemo(() => sellers.find((s) => s.id === product?.sellerId), [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
        <Header title="Товар" onBack={() => nav("/home")} />
        <div className="p-6 text-center text-gray-600">Товар не найден</div>
      </div>
    );
  }

  const qty = getItemQty(product.id, product.sellerId);
  const itemId = items.find((i) => i.productId === product.id && i.sellerId === product.sellerId)?.id;

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header
        title=""
        transparent
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setFavorite((v) => !v)}
              className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              aria-label="В избранное"
            >
              <Heart size={20} className={favorite ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button
              className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              aria-label="Поделиться"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              <Share2 size={20} />
            </button>
          </div>
        }
      />

      <div className="relative bg-white">
        <div className="aspect-square">
          <img src={product.images[imageIndex]} alt={product.title} className="w-full h-full object-cover" />
        </div>
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === imageIndex ? "bg-white w-6" : "bg-white/50"}`}
                aria-label={`Фото ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand ?? "FreshDash"}</p>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-sm text-gray-600">{product.unitLabel}</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{product.rating ?? 4.8}</span>
              <span className="text-sm text-gray-500">({product.reviewsCount ?? 342})</span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              🚀 {product.deliveryEtaMinutes ?? 15} мин
            </span>
          </div>

          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold">{product.price} ₽</span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through pb-1">{product.oldPrice} ₽</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-semibold mb-2">Описание</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description ??
              "Описание товара для MVP. В продакшене здесь будет полный текст и характеристики."}
          </p>
        </div>

        {seller && (
          <button 
            onClick={() => nav(`/seller/${seller.id}`)}
            className="w-full mt-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                {seller.logo ? <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-green-50" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">В магазин</p>
                <h3 className="font-bold text-gray-900 leading-tight">{seller.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Star size={12} className="fill-[var(--fresh-green)] text-[var(--fresh-green)]" />
                  <span className="font-medium text-gray-700">{seller.rating || 5.0}</span>
                  <span>({seller.reviewsCount || 0})</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-lg pb-0.5">
              ›
            </div>
          </button>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 mt-6">
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={qty}
            onIncrease={() => {
              if (itemId) increase(itemId);
              else addProduct(product);
            }}
            onDecrease={() => {
              if (itemId) decrease(itemId);
            }}
          />
          <button
            onClick={() => {
              if (qty === 0) addProduct(product);
              nav("/cart");
            }}
            className="flex-1 bg-[var(--fresh-green)] text-white rounded-2xl py-4 font-semibold shadow-sm"
          >
            {qty > 0 ? `В корзину · ${qty * product.price} ₽` : `В корзину · ${product.price} ₽`}
          </button>
        </div>
      </div>
    </div>
  );
}

