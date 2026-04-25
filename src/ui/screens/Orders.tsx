import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/ui/shared/Header";
import { useCartStore } from "@/ui/state/cartStore";
import { useOrdersStore } from "@/ui/state/ordersStore";
import type { OrderStatus } from "@/ui/state/types";

const filters: { id: "all" | OrderStatus; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "completed", label: "Завершённые" },
  { id: "cancelled", label: "Отменённые" },
];

function statusPill(status: OrderStatus) {
  if (status === "active") return <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">В пути</span>;
  if (status === "completed") return <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">Доставлен</span>;
  return <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">Отменён</span>;
}

export function Orders() {
  const nav = useNavigate();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const orders = useOrdersStore((s) => s.orders);
  const addSnapshotItems = useCartStore((s) => s.addSnapshotItems);
  const byStatus = useOrdersStore((s) => s.byStatus);

  const filtered = useMemo(() => byStatus(filter), [byStatus, filter, orders]);

  return (
    <div className="bg-[var(--fresh-bg)]">
      <Header title="Мои заказы" onBack={() => nav("/home")} />

      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium border ${
                  active
                    ? "bg-[var(--fresh-green)] text-white border-[var(--fresh-green)]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">Пока нет заказов</h3>
            <p className="text-sm text-gray-600 mb-4">
              Оформите заказ, и он появится в этом разделе.
            </p>
            <button
              onClick={() => nav("/catalog")}
              className="w-full bg-[var(--fresh-green)] text-white rounded-2xl py-3 font-semibold"
            >
              Перейти в каталог
            </button>
          </div>
        )}
        {filtered.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Заказ #{o.number}</h3>
                    {statusPill(o.status)}
                  </div>
                  <p className="text-xs text-gray-500">{o.date}</p>
                </div>
                {o.status === "active" && (
                  <button
                    onClick={() => nav(`/tracking/${o.id}`)}
                    className="text-sm text-[var(--fresh-green)] font-semibold"
                  >
                    Отследить
                  </button>
                )}
              </div>

              <div className="flex gap-3 mb-3">
                <img
                  src={o.items[0]?.imageSnapshot}
                  alt="Order"
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{o.items.length} товаров</p>
                  <p className="text-sm font-semibold">{o.totals.grandTotal} ₽</p>
                  <p className="text-xs text-gray-500 mt-1">{o.subOrders.length} подзаказ(ов)</p>
                </div>
              </div>

              {o.status === "completed" && (
                <button
                  onClick={() => {
                    addSnapshotItems(o.items);
                    nav("/cart");
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Повторить заказ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

