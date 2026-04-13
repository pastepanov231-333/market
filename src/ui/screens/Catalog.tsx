import { SlidersHorizontal, Search as SearchIcon, X, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/ui/shared/Header";
import { QuantityStepper } from "@/ui/shared/QuantityStepper";
import { useCartStore } from "@/ui/state/cartStore";
import { products, filterConfig, sellers } from "@/ui/state/mock";
import type { VitrineType } from "@/ui/state/types";
import { Star } from "lucide-react";

type MenuNode = { id: string; title: string; emoji: string; subtitle: string; isFolder?: boolean };

const mainVitrines: MenuNode[] = [
  { id: "all", title: "Все товары", emoji: "🛍️", subtitle: "Полный каталог маркетплейса" },
  { id: "foodMenu", title: "Еда", emoji: "🍎", subtitle: "Свежие продукты и готовые блюда", isFolder: true },
  { id: "clothes", title: "Одежда", emoji: "👕", subtitle: "Одежда и аксессуары" },
  { id: "toolsMenu", title: "Инструменты", emoji: "🔨", subtitle: "Для ремонта и строительства", isFolder: true },
];

const foodVitrines: MenuNode[] = [
  { id: "groceries", title: "Продукты", emoji: "🛒", subtitle: "Свежие продукты из магазинов" },
  { id: "ready_food", title: "Готовая еда", emoji: "🍱", subtitle: "Свежие блюда, только разогреть" },
  { id: "restaurantsMenu", title: "Рестораны/ФастФуд", emoji: "🍔", subtitle: "Доставка из любимых заведений", isFolder: true },
];

const restaurantVitrines: MenuNode[] = [
  { id: "seller-5", title: "Семейное кафе Кексбери", emoji: "🍱", subtitle: "Роллы, пицца, бургеры" },
  { id: "seller-6", title: "Бургер Хаус", emoji: "🍔", subtitle: "Самые сочные крафтовые бургеры" },
  { id: "seller-7", title: "ПиццаФабрика", emoji: "🍕", subtitle: "Настоящая итальянская пицца" },
  { id: "seller-8", title: "Грузинский Дворик", emoji: "🥟", subtitle: "Лучшие хинкали и хачапури" },
];

const toolsVitrines: MenuNode[] = [
  { id: "tools", title: "Инструменты", emoji: "🔧", subtitle: "Для ремонта" },
  { id: "components", title: "Комплектующие", emoji: "⚙️", subtitle: "Для бытовой техники" },
  { id: "electronics", title: "Электроника", emoji: "📱", subtitle: "Гаджеты и техника" },
];

export function Catalog() {
  const nav = useNavigate();
  const [viewLevel, setViewLevel] = useState<"root" | "foodMenu" | "restaurantsMenu" | "toolsMenu" | "products">("root");
  const [selected, setSelected] = useState<VitrineType | null>(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ categoryId: string | null; attributes: Record<string, string[]> }>({ categoryId: null, attributes: {} });
  const [tempFilters, setTempFilters] = useState<{ categoryId: string | null; attributes: Record<string, string[]> }>({ categoryId: null, attributes: {} });

  const addProduct = useCartStore((s) => s.addProduct);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const getItemQty = useCartStore((s) => s.getItemQty);
  const items = useCartStore((s) => s.items);

  const getItemId = (productId: string, sellerId: string) =>
    items.find((i) => i.productId === productId && i.sellerId === sellerId)?.id;

  const openFilters = () => {
    setTempFilters(activeFilters);
    setIsFilterOpen(true);
  };
  
  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterOpen(false);
  };
  
  const clearFilters = () => {
    const empty = { categoryId: null, attributes: {} };
    setTempFilters(empty);
    setActiveFilters(empty);
    setIsFilterOpen(false);
  };

  const filtered = useMemo(() => {
    if (!selected) return [];
    let result = selected === "all" ? products : products.filter((p) => p.vitrineType === selected);

    if (activeFilters.categoryId) {
      result = result.filter((p) => p.categoryIds.includes(activeFilters.categoryId!));
    }
    
    for (const [attrId, values] of Object.entries(activeFilters.attributes)) {
      if (values.length > 0) {
        result = result.filter((p) => {
          if (!p.attributes || !p.attributes[attrId]) return false;
          const pValues = Array.isArray(p.attributes[attrId]) ? p.attributes[attrId] : [p.attributes[attrId]];
          return pValues.some(v => values.includes(v as string));
        });
      }
    }

    return result;
  }, [selected, activeFilters]);

  const relevantSellers = useMemo(() => {
    if (!selected) return [];
    if (selected === "all") return sellers;
    const ids = new Set(products.filter(p => p.vitrineType === selected).map(p => p.sellerId));
    return sellers.filter(s => ids.has(s.id));
  }, [selected]);

  const handleSelect = (node: MenuNode) => {
    if (node.id.startsWith("seller-")) {
      nav(`/seller/${node.id}`);
      return;
    }
    if (node.id === "foodMenu") {
      setViewLevel("foodMenu");
    } else if (node.id === "restaurantsMenu") {
      setViewLevel("restaurantsMenu");
    } else if (node.id === "toolsMenu") {
      setViewLevel("toolsMenu");
    } else {
      setSelected(node.id as VitrineType);
      setViewLevel("products");
      setActiveFilters({ categoryId: null, attributes: {} });
    }
  };

  const handleBackToNav = () => {
    if (selected && ["sushi", "burgers", "pizza", "georgian"].includes(selected)) {
      setViewLevel("restaurantsMenu");
    } else if (selected && ["groceries", "ready_food"].includes(selected)) {
      setViewLevel("foodMenu");
    } else if (selected && ["tools", "components", "electronics"].includes(selected)) {
      setViewLevel("toolsMenu");
    } else {
      setViewLevel("root");
    }
    setSelected(null);
  };

  const renderGrid = (items: MenuNode[], title: string, subtitle: string, onBack: () => void, currentViewLevel?: string) => (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title={title} onBack={onBack} />
      <div className="px-4 py-6 bg-white mb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title === "Каталог" ? "Добро пожаловать!" : title}</h1>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="px-4 py-4 space-y-4">
        {items.map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelect(v)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl mb-3">{v.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.subtitle}</p>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (viewLevel === "root") {
    return renderGrid(mainVitrines, "Каталог", "Выберите витрину для покупок", () => nav("/home"), "root");
  }
  if (viewLevel === "foodMenu") {
    return renderGrid(foodVitrines, "Еда", "Продукты и блюда", () => setViewLevel("root"), "foodMenu");
  }
  const renderRestaurantGrid = (items: MenuNode[], title: string, subtitle: string, onBack: () => void) => (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title={title} onBack={onBack} />
      <div className="px-4 py-6 bg-white mb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="px-4 py-4 space-y-4">
        {items.map((v) => {
          const seller = sellers.find(s => s.id === v.id);
          return (
            <button
              key={v.id}
              onClick={() => handleSelect(v)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              {/* Banner image */}
              {seller?.bannerUrl ? (
                <div className="w-full h-32 overflow-hidden relative">
                  <img
                    src={seller.bannerUrl}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-5xl">{v.emoji}</span>
                </div>
              )}
              {/* Info row */}
              <div className="flex items-center gap-3 p-4">
                {seller?.logo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 -mt-8 bg-white shadow">
                    <img src={seller.logo} alt={v.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">{v.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{v.subtitle}</p>
                </div>
                <span className="text-gray-400 flex-shrink-0">›</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (viewLevel === "restaurantsMenu") {
    return renderRestaurantGrid(restaurantVitrines, "Рестораны/ФастФуд", "Доставка из любимых заведений", () => setViewLevel("foodMenu"));
  }
  if (viewLevel === "toolsMenu") {
    return renderGrid(toolsVitrines, "Инструменты", "Всё для ремонта и техники", () => setViewLevel("root"), "toolsMenu");
  }

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title="Каталог" onBack={handleBackToNav} />

      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <button
          onClick={() => nav("/search")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-2xl mb-4"
        >
          <SearchIcon size={20} className="text-gray-400" />
          <span className="text-gray-500">Искать товары</span>
        </button>

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {mainVitrines.map((v) => {
            const active = selected === v.id || 
                           (v.id === "foodMenu" && ["groceries", "ready_food", "sushi", "burgers", "pizza", "georgian"].includes(selected || ""));
            const label = v.id === "all" ? "Все" : v.title;
            return (
              <button
                key={v.id}
                onClick={() => handleSelect(v)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-medium border ${
                  active
                    ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">Найдено: {filtered.length} товаров</p>
        <button
          onClick={openFilters}
          className="flex items-center gap-2 text-sm font-medium text-gray-900"
          title="Фильтры"
        >
          <SlidersHorizontal size={18} />
          Фильтры
        </button>
      </div>

      {relevantSellers.length > 0 && (
        <div className="bg-white pt-4 pb-2 mb-2 border-b border-gray-100">
          <h2 className="text-sm font-bold px-4 mb-3 text-gray-900 uppercase tracking-wide">Магазины в этой категории</h2>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {relevantSellers.map(s => (
              <button 
                key={s.id} 
                onClick={() => nav(`/seller/${s.id}`)}
                className="w-48 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-3 text-left shadow-sm flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50">
                  {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-green-50" />}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{s.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Star size={10} className="fill-[var(--fresh-green)] text-[var(--fresh-green)]" />
                    <span className="font-medium text-gray-700">{s.rating || 5.0}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-4">

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
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
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-white w-full rounded-t-3xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 mt-2">
              <h2 className="text-xl font-bold">Фильтры</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 pb-32">
               {selected !== "all" && filterConfig[selected] ? (
                 <div className="mb-6">
                   <h3 className="font-semibold mb-3">Подкатегория</h3>
                   <div className="flex flex-wrap gap-2">
                     {filterConfig[selected].categories.map((cat: any) => (
                       <button
                         key={cat.id}
                         onClick={() => setTempFilters(prev => ({ categoryId: prev.categoryId === cat.id ? null : cat.id, attributes: {} }))}
                         className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                           tempFilters.categoryId === cat.id
                             ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)]"
                             : "bg-white text-gray-700 border-gray-200"
                         }`}
                       >
                         {cat.label}
                       </button>
                     ))}
                   </div>
                 </div>
               ) : null}
               
               {selected !== "all" && filterConfig[selected] && tempFilters.categoryId && (
                 <>
                   {filterConfig[selected].categories.find((c: any) => c.id === tempFilters.categoryId)?.attributes?.map((attr: any) => (
                     <div key={attr.id} className="mb-6">
                       <h3 className="font-semibold mb-3">{attr.label}</h3>
                       <div className="flex flex-wrap gap-2">
                         {attr.options.map((opt: any) => {
                           const isSelected = tempFilters.attributes[attr.id]?.includes(opt.id);
                           return (
                             <button
                               key={opt.id}
                               onClick={() => {
                                 setTempFilters(prev => {
                                   const current = prev.attributes[attr.id] || [];
                                   const next = isSelected ? current.filter(id => id !== opt.id) : [...current, opt.id];
                                   return { ...prev, attributes: { ...prev.attributes, [attr.id]: next } };
                                 });
                               }}
                               className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 transition-colors ${
                                 isSelected
                                   ? "bg-green-50 text-[var(--fresh-green)] border-[var(--fresh-green)]"
                                   : "bg-white text-gray-700 border-gray-200"
                               }`}
                             >
                               {isSelected && <Check size={14} strokeWidth={3} />} {opt.label}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                 </>
               )}

               {selected === "all" && (
                 <p className="text-gray-500 text-sm">Выберите другую вкладку (Продукты, Готовая еда и т.д.) вместо "Все", чтобы увидеть доступные параметры фильтрации.</p>
               )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={clearFilters}
                className="flex-1 py-4 rounded-2xl text-gray-700 font-semibold border border-gray-200"
              >
                Сбросить
              </button>
              <button
                onClick={applyFilters}
                className="flex-[2] py-4 rounded-2xl bg-[var(--fresh-green)] text-white font-semibold flex items-center justify-center gap-2"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

