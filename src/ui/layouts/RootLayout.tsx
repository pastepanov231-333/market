import { Outlet, useLocation } from "react-router";
import { PhoneFrame } from "@/ui/shared/PhoneFrame";
import { BottomNav } from "@/ui/shared/BottomNav";

const HIDE_NAV_PATHS = ["/", "/register", "/product", "/tracking", "/checkout"];

export function RootLayout() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[var(--fresh-bg)] overflow-hidden">
      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-0 relative ${
          location.pathname === "/stores" ? "overflow-hidden" : "overflow-y-auto"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Outlet />
      </div>

      {/* Persistent Navigation */}
      {!hideNav && (
        <div className="flex-none bg-white">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
