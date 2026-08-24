import { useNavigate } from "react-router-dom";
import { findProduct, money } from "../lib/data";
import { useStore } from "../context/StoreContext";
import { Crumbs, Qty } from "../components/ui";
import { Newsletter } from "../components/Sections";
export default function CartPage() {
    const { lines, subtotal, setQty, remove, wrap, setWrap, setDrawer } = useStore();
    const nav = useNavigate();
    return (<div>
      <div className="py-14 text-center">
        <h1 className="font-serif text-4xl">Shopping Cart</h1>
        <Crumbs items={[["Home", "/"], ["Your Shopping Cart"]]}/>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 pb-24">
        {lines.length === 0 ? (<div className="py-20 text-center">
            <p className="font-serif text-3xl">Your cart is empty</p>
            <p className="mt-3 text-sm text-mute">
              Fill it with something you'll actually wear.
            </p>
            <button onClick={() => nav("/shop")} className="btn-dark mt-8 px-10 py-3.5">
              Start Shopping
            </button>
          </div>) : (<>
            <div className="hidden grid-cols-12 gap-4 border-b border-line pb-3 text-[15px] font-medium md:grid">
              <span className="col-span-6">Product</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-2">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            <ul className="divide-y divide-line">
              {lines.map((l) => {
                const p = findProduct(l.productId);
                if (!p)
                    return null;
                return (<li key={`${l.productId}-${l.size}`} className="grid grid-cols-1 gap-5 py-8 md:grid-cols-12 md:items-center">
                    <div className="flex items-center gap-5 md:col-span-6">
                      <img src={p.image} alt={p.name} className="h-32 w-[104px] bg-[#f4f4f6] object-cover"/>
                      <div>
                        <p className="max-w-[220px] font-serif text-lg font-medium leading-snug">
                          {p.name}
                        </p>
                        <p className="mt-2 text-sm text-mute">
                          Color : {l.color}
                        </p>
                        <button onClick={() => remove(l.productId, l.size)} className="mt-3 text-sm text-gray-600 underline underline-offset-4 transition-colors hover:text-ink">
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-[15px] md:col-span-2">{money(p.price)}</p>
                    <div className="md:col-span-2 md:flex md:justify-center">
                      <Qty value={l.qty} onChange={(v) => setQty(l.productId, l.size, v)}/>
                    </div>
                    <p className="text-[15px] font-medium md:col-span-2 md:text-right">
                      {money(p.price * l.qty)}
                    </p>
                  </li>);
            })}
            </ul>

            <div className="mt-4 flex flex-col items-end gap-5">
              <label className="flex cursor-pointer items-center gap-3 text-gray-500">
                <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} className="h-4 w-4 accent-ink"/>
                For <strong className="text-ink">$10.00</strong> Please Wrap
                The Product
              </label>
              <hr className="w-full max-w-2xl border-line"/>
              <div className="flex w-full max-w-2xl items-center justify-between">
                <span className="font-serif text-xl">Subtotal</span>
                <span className="text-lg font-medium">{money(subtotal)}</span>
              </div>
              <button onClick={() => nav("/checkout")} className="btn-dark w-full max-w-2xl py-4">
                Checkout
              </button>
              <button onClick={() => setDrawer(true)} className="text-sm underline underline-offset-4">
                View Cart
              </button>
            </div>
          </>)}
      </div>

      <Newsletter />
    </div>);
}
