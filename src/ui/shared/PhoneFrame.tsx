import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  // На реальном iPhone: занимает весь экран, safe-area-inset автоматически
  // отодвигает контент от Dynamic Island сверху и Home Indicator снизу.
  // На ПК: отображается как макет телефона с ободком для удобства разработки.
  return (
    <div className="
      h-[100dvh] w-full
      sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:py-6 sm:px-4 sm:bg-gray-50
    ">
      <div className="
        h-full w-full flex flex-col overflow-hidden bg-white
        sm:max-w-[390px] sm:h-[calc(100vh-48px)] sm:max-h-[844px]
        sm:shadow-[0_0_40px_rgba(0,0,0,0.1)] sm:ring-8 sm:ring-gray-900 sm:rounded-[32px]
        relative
      ">
        {children}
      </div>
    </div>
  );
}


