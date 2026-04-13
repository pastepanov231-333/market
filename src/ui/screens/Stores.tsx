import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { sellers } from "@/ui/state/mock";
import { Star, X, Clock, ChevronRight } from "lucide-react";

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// App colors mapping
const CATEGORY_COLORS: Record<string, string> = {
  all: "#2dc36a",
  clothes: "#3b82f6",     // Blue
  restaurants: "#ef4444", // Red
  groceries: "#f59e0b",   // Orange
  tools: "#8b5cf6",       // Purple
  other: "#6b7280",       // Gray
};

const APP_GREEN = CATEGORY_COLORS.all;

// Custom SVG pin icon in app color
function makePin(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 30 40">
    <path d="M15 0C6.72 0 0 6.72 0 15c0 10.5 15 25 15 25S30 25.5 30 15C30 6.72 23.28 0 15 0z" fill="${color}"/>
    <circle cx="15" cy="15" r="7" fill="white"/>
  </svg>`;
  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  });
}

// Map Category Mapping
type MapCategory = "all" | "clothes" | "restaurants" | "groceries" | "other" | "tools";

const CATEGORIES: { id: MapCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "clothes", label: "Одежда" },
  { id: "restaurants", label: "Рестораны" },
  { id: "groceries", label: "Продукты" },
  { id: "tools", label: "Инструменты" },
  { id: "other", label: "Разное" },
];

// Pins data
interface PinData {
  id: string;
  lat: number;
  lon: number;
  sellerId: string;
  category: MapCategory;
}

const PINS: PinData[] = [
  // Кексбери (Restaurants)
  { id: "keksberi", lat: 65.992924, lon: 57.545415, sellerId: "seller-5", category: "restaurants" },
  
  // Провиант (Groceries) — 4 locations
  { id: "proviant-1", lat: 65.988092, lon: 57.563406, sellerId: "seller-1", category: "groceries" },
  { id: "proviant-2", lat: 65.995775, lon: 57.563258, sellerId: "seller-1", category: "groceries" },
  { id: "proviant-3", lat: 65.992849, lon: 57.538989, sellerId: "seller-1", category: "groceries" },
  { id: "proviant-4", lat: 65.993716, lon: 57.551486, sellerId: "seller-1", category: "groceries" },
  
  // Метизыч (Tools)
  { id: "metizych", lat: 65.993643, lon: 57.555087, sellerId: "seller-9", category: "tools" },
  
  // Urban Wear (Clothes)
  { id: "urban", lat: 65.99055, lon: 57.544885, sellerId: "seller-3", category: "clothes" },
  
  // ПиццаФабрика (Restaurants)
  { id: "pizzafabrika", lat: 65.992628, lon: 57.547658, sellerId: "seller-7", category: "restaurants" },
  
  // СтройИнструмент (Tools)
  { id: "stroyinstrument", lat: 65.995531, lon: 57.536771, sellerId: "seller-4", category: "tools" },
];

export function Stores() {
  const nav = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.FeatureGroup | null>(null);
  const [activeSeller, setActiveSeller] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MapCategory>("all");

  const activeSel = sellers.find((s) => s.id === activeSeller);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [65.992924, 57.545415], // Center on the requested pin
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Sync Markers when Category changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    // Clear old markers
    markersRef.current.clearLayers();

    // Filter pins
    const filteredPins = activeCategory === "all"
      ? PINS
      : PINS.filter(p => p.category === activeCategory);

    // Add new markers
    filteredPins.forEach((pin) => {
      const pinColor = CATEGORY_COLORS[pin.category] || APP_GREEN;
      const marker = L.marker([pin.lat, pin.lon], {
        icon: makePin(pinColor),
      }).addTo(markersRef.current!);

      marker.on("click", () => {
        setActiveSeller(pin.sellerId);
      });
    });

    // If active seller is not in filtered pins, hide the card
    if (activeSeller && !filteredPins.some(p => p.sellerId === activeSeller)) {
      setActiveSeller(null);
    }
  }, [activeCategory, activeSeller]);

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden">
      {/* Leaflet map — fills everything */}
      <div ref={mapRef} className="flex-1 w-full h-full" style={{ minHeight: 0, zIndex: 1 }} />

      {/* Floating Header Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none" style={{ zIndex: 20 }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm border border-gray-100 pointer-events-auto">
          Магазины в Усинске
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm border border-gray-100 pointer-events-auto">
          📍 Республика Коми
        </div>
      </div>

      {/* Category Filter Buttons (Floating Block) */}
      <div 
        className={`absolute left-0 right-0 z-[40] transition-all duration-500 pointer-events-none px-6 ${
          activeSeller ? "bottom-[280px]" : "bottom-10"
        }`}
      >
        <div className="flex flex-wrap gap-2.5 justify-center pointer-events-auto">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-[11px] font-extrabold transition-all shadow-lg animate-float ${
                activeCategory === cat.id
                  ? "text-white scale-110 z-10"
                  : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-100"
              }`}
              style={{ 
                backgroundColor: activeCategory === cat.id ? CATEGORY_COLORS[cat.id] : undefined,
                borderColor: activeCategory === cat.id ? CATEGORY_COLORS[cat.id] : undefined,
                animationDelay: `${idx * 0.15}s`
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom seller card */}
      {activeSeller && activeSel && (
        <div
          className="absolute left-0 right-0 bottom-0 z-50 px-3 pb-3"
          style={{ zIndex: 60 }}
        >
          <div className="bg-white rounded-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Banner */}
            {activeSel.bannerUrl && (
              <div className="w-full h-24 overflow-hidden relative">
                <img
                  src={activeSel.bannerUrl}
                  alt={activeSel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <div className="p-4 flex items-center gap-3">
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
                style={{ marginTop: activeSel.bannerUrl ? -24 : 0 }}
              >
                {activeSel.logo && (
                  <img src={activeSel.logo} alt={activeSel.name} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{activeSel.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-[var(--fresh-green)] text-[var(--fresh-green)]" />
                    <span className="text-xs font-bold text-gray-800">{activeSel.rating}</span>
                  </div>
                  {activeSel.deliveryEtaMinutes && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={11} />
                      <span>{activeSel.deliveryEtaMinutes} мин</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close row */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setActiveSeller(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              <button
                onClick={() => nav(`/seller/${activeSel.id}`)}
                className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
                style={{ background: APP_GREEN, color: "white" }}
              >
                {["seller-5", "seller-6", "seller-7", "seller-8"].includes(activeSel.id) 
                  ? "Перейти в Ресторан" 
                  : "Перейти в Магазин"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
