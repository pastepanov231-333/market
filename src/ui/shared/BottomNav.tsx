import { Home, MapPin, Package, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCartStore } from "@/ui/state/cartStore";
import { getTotalQty } from "@/ui/state/cartSelectors";

const items = [
  { path: "/home", label: "Главная", Icon: Home },
  { path: "/catalog", label: "Каталог", Icon: ShoppingBag },
  { path: "/cart", label: "Корзина", Icon: ShoppingCart },
  { path: "/orders", label: "Заказы", Icon: Package },
  { path: "/stores", label: "Магазины", Icon: MapPin },
  { path: "/profile", label: "Профиль", Icon: User },
];

export function BottomNav() {
  const nav = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((s) => s.items);
  const totalQty = useMemo(() => getTotalQty(cartItems), [cartItems]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex justify-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)", paddingTop: "0.5rem" }}
    >
      <div className="grid grid-cols-6 w-full max-w-md">
        {items.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => nav(path)}
              className={`py-3 flex flex-col items-center gap-1 text-xs ${
                active ? "text-[var(--fresh-green)]" : "text-gray-500"
              }`}
            >
              <span className="relative">
                <Icon size={22} />
                {path === "/cart" && totalQty > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-[var(--fresh-green)] text-white text-[10px] leading-5 text-center">
                    {totalQty}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
