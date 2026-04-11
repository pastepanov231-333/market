import { Outlet, useLocation } from "react-router";
import { PhoneFrame } from "@/ui/shared/PhoneFrame";
import { BottomNav } from "@/ui/shared/BottomNav";

const HIDE_NAV_PATHS = new Set(["/", "/register"]);

export function RootLayout() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.has(location.pathname);

  return (
    <div className="bg-[var(--fresh-bg)]">
      <PhoneFrame>
        <div className="flex-1 flex flex-col min-h-0 bg-[var(--fresh-bg)]">
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
          {!hideNav && (
            <div className="flex-none">
              <BottomNav />
            </div>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}

