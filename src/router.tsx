import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/ui/layouts/RootLayout";
import { Onboarding } from "@/ui/screens/Onboarding";
import { RegistrationStub } from "@/ui/screens/RegistrationStub";
import { Addresses } from "@/ui/screens/Addresses";
import { Home } from "@/ui/screens/Home";
import { Catalog } from "@/ui/screens/Catalog";
import { Search } from "@/ui/screens/Search";
import { ProductDetails } from "@/ui/screens/ProductDetails";
import { Cart } from "@/ui/screens/Cart";
import { Checkout } from "@/ui/screens/Checkout";
import { Tracking } from "@/ui/screens/Tracking";
import { Orders } from "@/ui/screens/Orders";
import { Profile } from "@/ui/screens/Profile";
import { SellerPage } from "@/ui/screens/SellerPage";
import { Stores } from "@/ui/screens/Stores";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Onboarding },
      { path: "register", Component: RegistrationStub },
      { path: "addresses", Component: Addresses },
      { path: "home", Component: Home },
      { path: "catalog", Component: Catalog },
      { path: "search", Component: Search },
      { path: "product/:id", Component: ProductDetails },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "tracking/:orderId", Component: Tracking },
      { path: "orders", Component: Orders },
      { path: "profile", Component: Profile },
      { path: "seller/:id", Component: SellerPage },
      { path: "stores", Component: Stores }
    ],
  },
]);

