import { CheckCircle2, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "@/ui/shared/Header";
import { useOrdersStore } from "@/ui/state/ordersStore";

type TrackingStatus = "preparing" | "ready" | "delivering" | "delivered";

const steps: { id: TrackingStatus; label: string; icon: string }[] = [
  { id: "preparing", label: "Собираем заказ", icon: "📦" },
  { id: "ready", label: "Заказ готов", icon: "✅" },
  { id: "delivering", label: "Курьер в пути", icon: "🚴" },
  { id: "delivered", label: "Доставлено", icon: "🎉" },
];

export function Tracking() {
  const nav = useNavigate();
  const { orderId } = useParams();
  const getOrderById = useOrdersStore((s) => s.getOrderById);
  const completeOrder = useOrdersStore((s) => s.completeOrder);
  const order = getOrderById(orderId);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<TrackingStatus>("preparing");

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 10));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 25 && status === "preparing") setStatus("ready");
    if (progress >= 60 && status === "ready") setStatus("delivering");
    if (progress >= 100 && status === "delivering") {
      setStatus("delivered");
      if (orderId) completeOrder(orderId);
    }
  }, [progress, status, orderId, completeOrder]);

  const currentIndex = useMemo(() => steps.findIndex((s) => s.id === status), [status]);

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title="Отслеживание заказа" onBack={() => nav("/orders")} />

      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <div className="text-5xl mb-4">{steps[currentIndex]?.icon}</div>
          <h2 className="text-xl font-bold mb-2">{steps[currentIndex]?.label}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {status === "preparing" && "Продавец собирает ваш заказ"}
            {status === "ready" && "Ожидаем курьера"}
            {status === "delivering" && "Курьер доставит через ~10 минут"}
            {status === "delivered" && "Ваш заказ доставлен. Приятного аппетита!"}
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--fresh-green)] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Готово на {progress}%</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-semibold mb-4">Статус заказа</h3>
          <div className="space-y-4">
            {steps.map((s, idx) => {
              const active = idx <= currentIndex;
              const current = s.id === status;
              return (
                <div key={s.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        active ? "bg-[var(--fresh-green)] text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {active ? <CheckCircle2 size={20} /> : <div className="w-3 h-3 rounded-full bg-gray-400" />}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-0.5 h-12 ${active ? "bg-[var(--fresh-green)]" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={`font-medium ${current ? "text-[var(--fresh-green)]" : active ? "text-gray-900" : "text-gray-400"}`}>
                      {s.label}
                    </p>
                    {current && <p className="text-xs text-gray-500 mt-1">Прямо сейчас</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {status === "delivering" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="aspect-video bg-gray-200 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center">
              <MapPin size={48} className="text-gray-400" />
              <p className="absolute bottom-4 text-sm text-gray-600">Карта с местоположением курьера</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold">Иван К.</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>~10 минут</span>
                </div>
              </div>
              <button className="px-3 py-2 rounded-2xl border border-gray-200 bg-white text-sm flex items-center gap-2">
                <Phone size={16} /> Позвонить
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-semibold mb-3">Информация о доставке</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Номер заказа</span>
              <span className="font-medium">#{order?.number ?? orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Адрес доставки</span>
              <span className="font-medium">ул. Тверская, 12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Время доставки</span>
              <span className="font-medium">Сейчас (15-25 мин)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Оплата</span>
              <span className="font-medium">
                {order?.paymentMethod === "sbp" ? "СБП" : "Карта"} (заглушка)
              </span>
            </div>
          </div>
        </div>

        {order && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold mb-3">Подзаказы по продавцам</h3>
            <div className="space-y-3">
              {order.subOrders.map((sub) => (
                <div key={sub.id} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{sub.sellerName}</p>
                    <p className="font-semibold">{sub.subtotal} ₽</p>
                  </div>
                  <div className="space-y-1">
                    {sub.items.map((item) => (
                      <div key={item.id} className="text-xs text-gray-600 flex justify-between">
                        <span>
                          {item.titleSnapshot} × {item.qty}
                        </span>
                        <span>{item.qty * item.priceSnapshot} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-2">
          <MessageCircle size={20} /> Связаться с поддержкой
        </button>

        {status === "delivered" && (
          <button
            onClick={() => nav("/orders")}
            className="w-full bg-[var(--fresh-green)] text-white rounded-2xl py-4 font-semibold"
          >
            Вернуться к заказам
          </button>
        )}
      </div>
    </div>
  );
}

