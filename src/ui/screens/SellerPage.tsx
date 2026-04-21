import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "@/ui/shared/Header";
import { QuantityStepper } from "@/ui/shared/QuantityStepper";
import { useCartStore } from "@/ui/state/cartStore";
import { products, sellers } from "@/ui/state/mock";
import { Star } from "lucide-react";

// Category tabs configuration per seller type
const FOOD_CATEGORIES = [
  { id: "all", label: "Все товары" },
  { id: "hot_dishes", label: "Горячие блюда" },
  { id: "rolls", label: "Роллы" },
  { id: "sushi", label: "Суши" },
  { id: "pizza", label: "Пицца" },
  { id: "sets", label: "Сеты" },
  { id: "drinks", label: "Напитки" },
  { id: "salads", label: "Салаты" },
];

const RESTAURANT_SELLER_IDS = new Set(["seller-5", "seller-6", "seller-7", "seller-8"]);
const CLOTHES_SELLER_IDS = new Set(["seller-3", "seller-11", "seller-12"]);

const CLOTHES_CATEGORIES = [
  { id: "all", label: "Все товары" },
  { id: "outerwear", label: "Верхняя одежда" },
  { id: "tshirts", label: "Футболки и майки" },
  { id: "shirts", label: "Рубашки" },
  { id: "sweaters", label: "Свитеры и толстовки" },
  { id: "jeans", label: "Джинсы" },
  { id: "pants", label: "Брюки" },
  { id: "sportswear", label: "Спортивная одежда" },
  { id: "shoes", label: "Обувь" },
  { id: "underwear", label: "Нижнее белье и носки" },
  { id: "headwear", label: "Головные уборы" },
  { id: "accessories", label: "Аксессуары" },
];

export function SellerPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("all");

  const seller = sellers.find(s => s.id === id);
  const sellerProducts = products.filter(p => p.sellerId === id);

  const isRestaurant = id ? RESTAURANT_SELLER_IDS.has(id) : false;
  const isClothesStore = id ? CLOTHES_SELLER_IDS.has(id) : false;
  
  const showCategories = isRestaurant || isClothesStore;
  const categoriesToShow = isRestaurant ? FOOD_CATEGORIES : (isClothesStore ? CLOTHES_CATEGORIES : []);

  // Filter products based on active category
  const filteredProducts = activeCategory === "all"
    ? sellerProducts
    : sellerProducts.filter(p => p.categoryIds.includes(activeCategory));

  const addProduct = useCartStore((s) => s.addProduct);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const getItemQty = useCartStore((s) => s.getItemQty);
  const items = useCartStore((s) => s.items);

  const getItemId = (productId: string, sellerId: string) =>
    items.find((i) => i.productId === productId && i.sellerId === sellerId)?.id;

  if (!seller) {
    return (
      <div className="min-h-screen bg-[var(--fresh-bg)]">
        <Header title="Продавец не найден" onBack={() => nav(-1)} />
        <div className="p-4 text-center text-gray-500 mt-20">Магазин не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      {/* Dynamic Cover/Banner Component */}
      <div className="relative h-48 sm:h-56 w-full bg-gradient-to-r from-green-400 to-green-600"
           style={seller.bannerUrl?.includes("metizych") ? { background: "#f5c518" } : undefined}>
        {seller.bannerUrl && (
          <img 
            src={seller.bannerUrl} 
            alt={seller.name} 
            className={`absolute inset-0 w-full h-full ${
              seller.bannerUrl.includes("metizych") ? "object-contain" : "object-cover"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-black/5" />
        
        {/* Top absolute header inside the banner */}
        <div className="absolute top-0 inset-x-0 z-10 px-4 pt-safe flex items-center justify-between h-14">
          <button 
            onClick={() => nav(-1)} 
            className="w-10 h-10 rounded-full bg-white/40 backdrop-blur flex items-center justify-center text-white"
          >
            <span className="text-2xl leading-none -mt-1">‹</span>
          </button>
        </div>
      </div>

      {/* Info Card Overlaying Banner */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border-4 border-white shadow-sm -mt-10">
            <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 mt-1">
            <h1 className="text-xl font-bold leading-tight mb-1">{seller.name}</h1>
            <div className="flex items-center gap-1.5 text-sm mb-2 text-gray-600">
              <Star size={14} className="fill-[var(--fresh-green)] text-[var(--fresh-green)]" />
              <span className="font-semibold text-gray-800">{seller.rating}</span>
              <span className="text-gray-400">({seller.reviewsCount})</span>
              <span className="mx-1 text-gray-300">•</span>
              <span>{seller.deliveryEtaMinutes} мин</span>
            </div>
          </div>
        </div>
        
        {seller.description && (
          <div className="bg-white rounded-2xl p-4 mt-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 text-sm text-gray-600">
            {seller.description}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      {showCategories && (
        <div className="mt-5 px-4">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categoriesToShow.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-medium border transition-colors flex-shrink-0 ${
                    isActive
                      ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)]"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Assortment */}
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold mb-4">Ассортимент</h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-3 text-left">
              <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden mb-3">
                <button onClick={() => nav(`/product/${p.id}`)} className="w-full h-full">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain p-2" />
                </button>
              </div>
              <p className="text-sm text-gray-900 line-clamp-2 min-h-[40px] mb-1">
                {p.title}
              </p>
              <p className="text-xs text-gray-500 mb-2">{p.unitLabel}</p>
              <div className="flex items-center justify-between">
                <div className="font-bold">{p.price} ₽</div>
                <QuantityStepper
                  value={getItemQty(p.id, p.sellerId)}
                  onIncrease={() => {
                    const itemId = getItemId(p.id, p.sellerId);
                    if (itemId) increase(itemId);
                    else addProduct(p);
                  }}
                  onDecrease={() => {
                    const itemId = getItemId(p.id, p.sellerId);
                    if (itemId) decrease(itemId);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            {activeCategory === "all" ? "Здесь пока нет товаров" : "В этой категории пока нет товаров"}
          </div>
        )}
      </div>
    </div>
  );
}
