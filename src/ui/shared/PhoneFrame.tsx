import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gray-50">
      <div className="w-full max-w-[390px] h-[calc(100vh-48px)] max-h-[844px] shadow-[0_0_40px_rgba(0,0,0,0.1)] ring-8 ring-gray-900 rounded-[32px] overflow-hidden bg-white flex flex-col relative">
        {children}
      </div>
    </div>
  );
}

