import { Bell, CreditCard, HelpCircle, LogOut, MapPin, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Header } from "@/ui/shared/Header";

export function Profile() {
  const nav = useNavigate();

  const menu = [
    { icon: <MapPin size={20} />, label: "Мои адреса", action: () => nav("/addresses") },
    { icon: <CreditCard size={20} />, label: "Способы оплаты", action: () => alert("Скоро") },
    { icon: <Bell size={20} />, label: "Уведомления", badge: "3", action: () => alert("Скоро") },
    { icon: <HelpCircle size={20} />, label: "Помощь и поддержка", action: () => alert("Скоро") },
    { icon: <Settings size={20} />, label: "Настройки", action: () => alert("Скоро") },
  ];

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title="Профиль" onBack={() => nav("/home")} />

      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--fresh-green)] to-[var(--fresh-green-dark)] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              АИ
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Анна Иванова</h2>
              <p className="text-sm text-gray-600">+7 (999) 123-45-67</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["12", "Заказов"],
              ["1,245", "Баллов"],
              ["5%", "Кэшбэк"],
            ].map(([value, label]) => (
              <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-[var(--fresh-green)]">{value}</p>
                <p className="text-xs text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-700">{item.icon}</div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        <button
          onClick={() => nav("/")}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Выйти из аккаунта</span>
        </button>

        <p className="text-xs text-gray-500 text-center">Версия 0.1 • FreshDash © 2026</p>
      </div>
    </div>
  );
}

