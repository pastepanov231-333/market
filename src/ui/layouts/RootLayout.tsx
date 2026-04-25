import { Outlet, useLocation } from "react-router";
import { PhoneFrame } from "@/ui/shared/PhoneFrame";
import { BottomNav } from "@/ui/shared/BottomNav";

const HIDE_NAV_PATHS = new Set(["/", "/register"]);

export function RootLayout() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.has(location.pathname);
  const isDev = import.meta.env.MODE === "development";

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--fresh-bg)]">
      {isDev ? (
        <PhoneFrame>
          {/* Top safe‑area for Dynamic Island / notch. On desktop safe‑area = 0. */}
          <div
            className="flex-1 flex flex-col min-h-0 bg-[var(--fresh-bg)]"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div
              className={`flex-1 min-h-0 ${location.pathname === "/stores" ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}
            >
              <Outlet />
            </div>
            {!hideNav && (
              <div className="flex-none">
                <BottomNav />
              </div>
            )}
          </div>
        </PhoneFrame>
      ) : (
        <div
          className="flex-1 flex flex-col min-h-0 bg-[var(--fresh-bg)]"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div
            className={`flex-1 min-h-0 ${location.pathname === "/stores" ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}
          >
            <Outlet />
          </div>
          {!hideNav && (
            <div className="flex-none">
              <BottomNav />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
