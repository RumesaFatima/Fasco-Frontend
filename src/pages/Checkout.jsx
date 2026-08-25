import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findProduct, money } from "../lib/data";
import { useStore } from "../context/StoreContext";
import { CheckIc, Crumbs, LockIc } from "../components/ui";
import { Newsletter } from "../components/Sections";
const COUNTRIES = ["United States", "United Kingdom", "India", "Germany", "United Arab Emirates", "Australia"];
export default function Checkout() {
  const { lines, subtotal, shipping, wrap, user, placeOrder, toast } = useStore();
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      toast("Please login to continue to checkout.");
      nav("/login");
    }
  }, [user, nav, toast]);
  const [f, setF] = useState({
    email: user?.email ?? "",
    country: "",
    first: user?.firstName ?? "",
    last: user?.lastName ?? "",
    address: "",
    city: "",
    postal: "",
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [pay, setPay] = useState({ method: "Credit Card", num: "", exp: "", cvc: "", holder: "" });
  const [saveCard, setSaveCard] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(null);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setP = (k) => (e) => setPay({ ...pay, [k]: e.target.value });
  const wrapCost = wrap && lines.length ? 10 * lines.length : 0;
  const grand = Math.max(0, subtotal - discount) + shipping + wrapCost;
  const apply = () => {
    const c = code.trim().toUpperCase();
    if (c === "FASCO10") {
      setDiscount(subtotal * 0.1);
      setApplied(c);
      toast("FASCO10 applied — 10% off");
    }
    else if (c === "FASCO20") {
      setDiscount(subtotal * 0.2);
      setApplied(c);
      toast("FASCO20 applied — 20% off");
    }
    else {
      toast("Invalid discount code");
    }
  };
  const payNow = async () => {
    const required = [f.email, f.country, f.first, f.last, f.address, f.city, f.postal, pay.num, pay.exp, pay.cvc, pay.holder];
    if (required.some((x) => !x.trim())) {
      toast("Please fill all required fields");
      return;
    }
    if (pay.num.replace(/\D/g, "").length < 12) {
      toast("Enter a valid card number");
      return;
    }
    setBusy(true);
    const o = await placeOrder({
      firstName: f.first,
      lastName: f.last,
      country: f.country,
      address: f.address,
      city: f.city,
      postal: f.postal,
    }, discount, f.email);
    setBusy(false);
    setOrder(o);
    window.scrollTo({ top: 0 });
  };
  if (order) {
    return (<div className="py-24">
      <div className="mx-auto max-w-xl px-5 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e8f5ec] text-[#3d7a5a]">
          <CheckIc className="h-9 w-9" />
        </span>
        <h1 className="mt-8 font-serif text-4xl">Order Placed!</h1>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          Thank you, {order.address.firstName}. Your order{" "}
          <strong className="text-ink">{order.id}</strong> is being packed.
          A confirmation is on its way to{" "}
          <strong className="text-ink">{order.email}</strong>.
        </p>
        <div className="mt-8 rounded-lg border border-line bg-white p-6 text-left text-sm">
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-mute">Items</span>
            <span>{order.lines.reduce((a, l) => a + l.qty, 0)}</span>
          </div>
          <div className="flex justify-between border-b border-line py-3">
            <span className="text-mute">Delivery to</span>
            <span className="max-w-[60%] text-right">
              {order.address.city}, {order.address.country}
            </span>
          </div>
          <div className="flex justify-between pt-3 font-serif text-lg">
            <span>Total Paid</span>
            <span>{money(order.total)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => nav("/shop")} className="btn-dark px-8 py-3.5">
            Continue Shopping
          </button>
          {user && (<button onClick={() => nav("/account")} className="btn-outline px-8 py-3.5">
            My Orders
          </button>)}
        </div>
      </div>
    </div>);
  }
  return (<div>
    <div className="border-b border-line py-14 text-center">
      <h1 className="font-serif text-4xl">FASCO Demo Checkout</h1>
      <Crumbs items={[["Home", "/"], ["Your Shopping Cart", "/cart"], ["Checkout"]]} />
    </div>

    {lines.length === 0 ? (<div className="py-24 text-center">
      <p className="font-serif text-2xl">Your cart is empty</p>
      <button onClick={() => nav("/shop")} className="btn-dark mt-6 px-10 py-3.5">
        Start Shopping
      </button>
    </div>) : (<div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 lg:grid-cols-[1fr_400px]">
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-3xl">Contact</h2>
          <p className="text-sm text-mute">
            Have an account?{" "}
            <Link to="/login" className="text-royal hover:underline">
              Create Account
            </Link>
          </p>
        </div>
        <input type="email" value={f.email} onChange={set("email")} placeholder="Email Address" className="box-input mt-5" />

        <h2 className="mt-12 font-serif text-3xl">Delivery</h2>
        <select value={f.country} onChange={set("country")} className="box-input mt-5 cursor-pointer">
          <option value="">Country / Region</option>
          {COUNTRIES.map((c) => (<option key={c}>{c}</option>))}
        </select>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input value={f.first} onChange={set("first")} placeholder="First Name" className="box-input" />
          <input value={f.last} onChange={set("last")} placeholder="Last Name" className="box-input" />
        </div>
        <input value={f.address} onChange={set("address")} placeholder="Address" className="box-input mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input value={f.city} onChange={set("city")} placeholder="City" className="box-input" />
          <input value={f.postal} onChange={set("postal")} placeholder="Postal Code" className="box-input" />
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-600">
          <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} className="h-4 w-4 accent-ink" />
          Save This Info For Future
        </label>

        <h2 className="mt-12 font-serif text-3xl">Payment</h2>
        <div className="mt-5 rounded-lg bg-[#f6f6f8] p-5">
          <div className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
            <select value={pay.method} onChange={setP("method")} className="bg-transparent text-sm outline-none">
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>PayPal</option>
            </select>
            <span className="relative flex" title="Mastercard">
              <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
              <span className="-ml-2 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
            </span>
          </div>
          <div className="relative mt-4">
            <input value={pay.num} onChange={setP("num")} placeholder="Card Number" className="box-input pr-11" />
            <LockIc className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input value={pay.exp} onChange={setP("exp")} placeholder="Expiration Date" className="box-input" />
            <input value={pay.cvc} onChange={setP("cvc")} placeholder="Security Code" className="box-input" />
          </div>
          <input value={pay.holder} onChange={setP("holder")} placeholder="Card Holder Name" className="box-input mt-4" />
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-600">
            <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="h-4 w-4 accent-ink" />
            Save This Info For Future
          </label>
        </div>

        <button onClick={payNow} disabled={busy} className="btn-dark mt-8 w-full py-4 disabled:opacity-60">
          {busy ? "Processing..." : "Pay Now"}
        </button>
        <p className="mt-10 text-center text-xs text-mute">
          Copyright © 2026 FASCO. All Rights Reserved.
        </p>
      </div>

      <div className="h-fit rounded-lg bg-[#f7f7f9] p-7">
        <ul className="space-y-5">
          {lines.map((l) => {
            const p = findProduct(l.productId);
            if (!p)
              return null;
            return (<li key={`${l.productId}-${l.size}`} className="flex items-center gap-4">
              <img src={p.image} alt={p.name} className="h-20 w-16 rounded object-cover bg-white" />
              <div className="flex-1">
                <p className="font-serif text-[15px] font-medium leading-snug">
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-mute">
                  {l.color} · Size {l.size} · Qty {l.qty}
                </p>
              </div>
              <p className="text-sm font-medium">{money(p.price * l.qty)}</p>
            </li>);
          })}
        </ul>

        <div className="mt-6 flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="box-input flex-1 bg-white" />
          <button onClick={apply} className="btn-dark px-6" disabled={!!applied}>
            {applied ? applied : "Apply"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-mute">
          Try <strong>FASCO10</strong> or <strong>FASCO20</strong>
        </p>

        <div className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-mute">Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mute">Shipping</span>
            <span>{shipping === 0 ? "FREE" : money(shipping)}</span>
          </div>
          {wrapCost > 0 && (<div className="flex justify-between">
            <span className="text-mute">Gift Wrap</span>
            <span>{money(wrapCost)}</span>
          </div>)}
          {discount > 0 && (<div className="flex justify-between text-[#3d7a5a]">
            <span>Discount ({applied})</span>
            <span>− {money(discount)}</span>
          </div>)}
          <div className="flex justify-between border-t border-line pt-3 font-serif text-lg">
            <span>Total</span>
            <span className="font-medium">{money(grand)}</span>
          </div>
        </div>
      </div>
    </div>)}

    <Newsletter />
  </div>);
}
