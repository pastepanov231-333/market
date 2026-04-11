import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

export function Header({
  title,
  onBack,
  actions,
  transparent,
}: {
  title: string;
  onBack?: () => void;
  actions?: ReactNode;
  transparent?: boolean;
}) {
  const nav = useNavigate();
  const back = onBack ?? (() => nav(-1));

  return (
    <div
      className={`sticky top-0 z-20 px-4 pt-4 pb-3 ${
        transparent ? "bg-transparent" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={back}
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            transparent ? "bg-white/90" : "bg-gray-100"
          }`}
          aria-label="Назад"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        {actions}
      </div>
    </div>
  );
}

