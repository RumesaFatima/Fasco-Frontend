import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import {
  BagIc,
  ChevronIc,
  SearchIc,
  StarIc,
  UserIc,
} from "./ui";

function NavItem({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`text-[15px] transition-colors hover:text-ink ${
        active
          ? "text-ink underline decoration-1 underline-offset-10"
          : "text-gray-500"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { count, setDrawer, user } = useStore();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const nav = useNavigate();
  const { pathname } = useLocation();

  const submit = () => {
    setOpen(false);

    nav(
      q.trim()
        ? `/shop?q=${encodeURIComponent(q.trim())}`
        : "/shop"
    );

    setQ("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* LOGO */}
        <Link
          to="/"
          className="font-serif text-[26px] font-bold tracking-[0.22em] text-ink"
        >
          FASCO
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-9 lg:flex">
          <NavItem
            to="/"
            label="Home"
            active={pathname === "/"}
          />

          <NavItem
            to="/shop"
            label="Shop"
            active={pathname === "/shop"}
          />

          <NavItem
            to="/shop"
            label="Products"
            active={pathname.startsWith("/product")}
          />

          {/* PAGES */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-[15px] text-gray-500 transition-colors hover:text-ink"
            >
              Pages
              <ChevronIc className="h-3.5 w-3.5" />
            </button>

            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="w-40 border border-line bg-white py-2 shadow-lg">
                <Link
                  to="/about"
                  className="block px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-[#f6f6f8] hover:text-ink"
                >
                  About
                </Link>

                <Link
                  to="/services"
                  className="block px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-[#f6f6f8] hover:text-ink"
                >
                  Services
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-5 text-ink">

          {/* SEARCH */}
          <div className="hidden items-center sm:flex">
            <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
              {open && (
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && submit()
                  }
                  onBlur={() => !q && setOpen(false)}
                  placeholder="Search products..."
                  className="w-44 border-b border-line bg-transparent pb-1 text-sm outline-none placeholder:text-mute"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="ml-1 transition-transform hover:scale-110"
              aria-label="search"
            >
              <SearchIc />
            </button>
          </div>

          {/* USER / DASHBOARD */}
          <Link
            to={user ? "/dashboard" : "/login"}
            className="transition-transform hover:scale-110"
            aria-label={user ? "dashboard" : "login"}
          >
            <UserIc />
          </Link>

          {/* WISHLIST */}
          <Link
            to="/shop"
            className="hidden transition-transform hover:scale-110 sm:block"
            aria-label="wishlist"
          >
            <StarIc
              className="h-5 w-5"
              filled={false}
            />
          </Link>

          {/* CART */}
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="relative transition-transform hover:scale-110"
            aria-label="cart"
          >
            <BagIc />

            {count > 0 && (
              <span
                key={count}
                className="badge-pop absolute -right-2 -top-2 grid min-w-[18px] place-items-center rounded-full bg-pop px-1 text-[10px] font-medium text-white"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}