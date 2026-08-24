import { useNavigate } from "react-router-dom";
import { findProduct, money } from "../lib/data";
import { useStore } from "../context/StoreContext";
import { Qty, XIcon } from "./ui";
export default function CartDrawer() {
    const { drawer, setDrawer, lines, subtotal, setQty, remove, wrap, setWrap, shipping, } = useStore();
    const nav = useNavigate();
    const freeGap = Math.max(0, 75 - subtotal);
    const go = (path) => {
        setDrawer(false);
        nav(path);
    };
    return (<div className={`fixed inset-0 z-50 ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
      <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${drawer ? "opacity-100" : "opacity-0"}`}/>
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.25,.7,.2,1)] ${drawer ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-2xl">Shopping Cart</h2>
          <button onClick={() => setDrawer(false)} className="transition-transform hover:scale-110" aria-label="close cart">
            <XIcon />
          </button>
        </div>

        {lines.length > 0 && freeGap > 0 && (<div className="border-b border-line px-6 py-4">
            <p className="text-sm">
              Buy <strong>{money(freeGap)}</strong> More And Get{" "}
              <strong>Free Shipping</strong>
            </p>
            <div className="mt-2.5 h-1 overflow-hidden rounded bg-line">
              <div className="h-full bg-ink transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 75) * 100)}%` }}/>
            </div>
          </div>)}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (<div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-xl">Your cart is empty</p>
              <p className="mt-2 text-sm text-mute">
                The best pieces rarely wait around.
              </p>
              <button onClick={() => go("/shop")} className="btn-dark mt-6 px-8 py-3">
                Continue Shopping
              </button>
            </div>) : (<ul className="divide-y divide-line">
              {lines.map((l) => {
                const p = findProduct(l.productId);
                if (!p)
                    return null;
                return (<li key={`${l.productId}-${l.size}`} className="flex gap-4 py-4">
                    <button onClick={() => go(`/product/${p.id}`)} className="shrink-0 cursor-pointer">
                      <img src={p.image} alt={p.name} className="h-24 w-20 rounded object-cover bg-[#f4f4f6]"/>
                    </button>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-[15px] font-medium leading-tight">
                            {p.name}
                          </p>
                          <p className="mt-1 text-xs text-mute">
                            Color: {l.color} · Size: {l.size}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {money(p.price * l.qty)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Qty small value={l.qty} onChange={(v) => setQty(l.productId, l.size, v)}/>
                        <button onClick={() => remove(l.productId, l.size)} className="text-xs text-mute underline underline-offset-4 transition-colors hover:text-ink">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>);
            })}
            </ul>)}
        </div>

        {lines.length > 0 && (<div className="border-t border-line px-6 py-5">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
              <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} className="h-4 w-4 accent-ink"/>
              For <strong className="text-ink">$10.00</strong> Please Wrap The
              Product
            </label>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-serif text-lg">Subtotal</span>
              <span className="text-lg font-medium">{money(subtotal)}</span>
            </div>
            {shipping === 0 && subtotal > 0 && (<p className="mt-1 text-xs text-[#3d7a5a]">
                You're getting free shipping 🎉
              </p>)}
            <button onClick={() => go("/checkout")} className="btn-dark mt-4 w-full py-4">
              Checkout
            </button>
            <button onClick={() => go("/cart")} className="mt-3 w-full text-center text-sm underline underline-offset-4">
              View Cart
            </button>
          </div>)}
      </aside>
    </div>);
}
