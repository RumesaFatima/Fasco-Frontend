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
import PaymentSuccessful from "./pages/PaymentSuccessful";
import PaymentCancelled from "./pages/PaymentCancelled";

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
  const { toasts, closeToast } = useStore();

  return (
    <>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 px-4"
        >
          <div className="w-full max-w-[360px] border border-[#e8e8e8] bg-white px-7 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="mb-4 text-[11px] tracking-[0.25em] text-[#aaa]">
              FASCO
            </div>

            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#222]">
              <CheckIc className="h-4 w-4 text-black" />
            </div>

            <h3 className="mb-2 font-serif text-[20px] text-[#111]">
              {t.type === "error" ? "Something Went Wrong" : "Success"}
            </h3>

            <p className="mx-auto mb-6 max-w-[270px] text-[12px] leading-5 text-[#666]">
              {t.msg}
            </p>

            <button
              type="button"
              className="w-full bg-black py-3 text-[11px] font-medium tracking-[0.18em] text-white transition hover:bg-[#222]"
              onClick={() => closeToast(t.id)}
            >
              OK
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

function Shell() {
  const { pathname } = useLocation();

  const bare = BARE.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(path + "/")
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
            path="/payment-success"
            element={<PaymentSuccessful />}
          />

          <Route
            path="/payment-cancelled"
            element={<PaymentCancelled />}
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
