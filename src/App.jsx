import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { StoreProvider, useStore } from "./context/StoreContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import AuthStyles from "./components/AuthStyles";
import { CheckIc } from "./components/ui";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/Product";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { About, Services } from "./pages/InfoPages";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

const BARE = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  return null;
}

function AuthBridge() {
  const { pathname } = useLocation();
  const { setUser } = useStore();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const raw = localStorage.getItem("user");

      if (!token || !raw) {
        setUser(null);
        return;
      }

      const user = JSON.parse(raw);

      const parts = String(user.name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const normalized = user.firstName
        ? user
        : {
          ...user,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        };

      setUser(normalized, token);
    } catch {
      setUser(null);
    }
  }, [pathname, setUser]);

  return null;
}

function Toasts() {
  const { toasts } = useStore();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-70 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in flex items-center gap-2.5 rounded-lg bg-ink px-5 py-3.5 text-sm text-white shadow-xl"
        >
          <CheckIc className="h-4 w-4 text-[#8ee6a1]" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();

  const bare = BARE.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {bare && <AuthStyles />}

      {!bare && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            path="*"
            element={<Home />}
          />

        </Routes>
      </main>
      {!bare && <Footer />}

      <CartDrawer />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthBridge />
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  );
}