import { MapPin, Plus, Home as HomeIcon, Briefcase, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/ui/shared/Header";

type AddressIcon = "home" | "work" | "other";

type Address = {
  id: string;
  label: string;
  address: string;
  details: string;
  icon: AddressIcon;
};

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Дом",
    address: "ул. Тверская, 12",
    details: "Подъезд 3, этаж 5, кв. 42",
    icon: "home",
  },
  {
    id: "2",
    label: "Работа",
    address: "Садовая-Кудринская ул., 32",
    details: "Офис 501, 5 этаж",
    icon: "work",
  },
];

function getIcon(icon: AddressIcon) {
  if (icon === "home") return <HomeIcon size={20} />;
  if (icon === "work") return <Briefcase size={20} />;
  return <MapPin size={20} />;
}

export function Addresses() {
  const nav = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const selectAndGo = (id: string) => {
    setSelectedAddress(id);
    setTimeout(() => nav("/home"), 250);
  };

  return (
    <div className="min-h-screen bg-[var(--fresh-bg)] pb-20">
      <Header title="Адрес доставки" onBack={() => nav("/register")} />

      <div className="px-4 py-6">
        <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Карта с вашим местоположением</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => selectAndGo("current")}
          className="w-full mb-6 px-4 py-3 rounded-2xl border border-gray-200 bg-white flex items-center gap-2 justify-start"
        >
          <MapPin size={20} className="text-[var(--fresh-green)]" />
          Использовать текущее местоположение
        </button>

        <h2 className="text-lg font-semibold mb-3">Сохраненные адреса</h2>
        <div className="space-y-3 mb-4">
          {mockAddresses.map((a) => (
            <button
              key={a.id}
              onClick={() => selectAndGo(a.id)}
              className="w-full p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[var(--fresh-green)]/10 rounded-xl flex items-center justify-center text-[var(--fresh-green)] flex-shrink-0">
                  {getIcon(a.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{a.label}</h3>
                    {selectedAddress === a.id && (
                      <Star size={16} className="text-[var(--fresh-green)] fill-[var(--fresh-green)]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{a.address}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.details}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Добавить новый адрес
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="w-full max-w-[390px] bg-white rounded-t-3xl p-4">
            <h3 className="text-xl font-bold mb-3">Новый адрес</h3>
            <div className="space-y-3">
              {[
                ["Адрес", "Введите адрес"],
                ["Подъезд", "Номер подъезда"],
                ["Этаж", "Номер этажа"],
                ["Квартира/офис", "Номер квартиры"],
                ["Код домофона", "Код для входа"],
                ["Комментарий курьеру", "Дополнительная информация"],
              ].map(([label, placeholder]) => (
                <label key={label} className="block">
                  <span className="text-xs text-gray-500">{label}</span>
                  <input
                    placeholder={placeholder}
                    className="mt-1 w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--fresh-green)]"
                  />
                </label>
              ))}
            </div>
            <div className="pt-4 flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 px-4 py-3 rounded-2xl bg-[var(--fresh-green)] text-white font-semibold"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

