import { Link } from "react-router-dom";
export default function Footer() {
    return (<footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-1280px px-5 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="font-serif text-2xl font-bold tracking-[0.22em]">
            FASCO
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-8 text-[15px] text-gray-600">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <Link to="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
            <Link to="/shop" className="transition-colors hover:text-ink">
              Products
            </Link>
            <Link to="/about" className="transition-colors hover:text-ink">
              Pages
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-center text-xs text-mute">
          Copyright © 2026 FASCO. All Rights Reserved.
        </p>
      </div>
    </footer>);
}
