import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/data";
import { Crumbs } from "../components/ui";
export default function Account() {
    const { user, logout, getMyOrders, toast } = useStore();
    const nav = useNavigate();
    const [orders, setOrders] = useState(null);
    useEffect(() => {
        if (!user) {
            nav("/login", { replace: true });
            return;
        }
        getMyOrders().then(setOrders);
    }, [user, getMyOrders, nav]);
    if (!user)
        return null;
    const initials = (user.firstName[0] || "F") + (user.lastName[0] || "A");
    return (<div className="mx-auto max-w-[1100px] px-5 pb-24 pt-14">
      <Crumbs items={[["Home", "/"], ["My Account"]]}/>

      <div className="mt-8 flex flex-wrap items-center gap-5 border border-line bg-white p-8">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-ink font-serif text-xl text-white">
          {initials}
        </span>
        <div className="flex-1">
          <h1 className="font-serif text-2xl">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 text-sm text-mute">
            {user.email}
            {user.phone ? ` · ${user.phone}` : ""}
          </p>
        </div>
        <button onClick={() => {
            logout();
            toast("Signed out");
            nav("/");
        }} className="btn-outline px-6 py-2.5">
          Logout
        </button>
      </div>

      <h2 className="mt-12 font-serif text-2xl">My Orders</h2>
      <div className="mt-5 grid gap-4">
        {orders === null ? (<p className="py-6 text-sm text-mute">Loading your orders...</p>) : orders.length === 0 ? (<div className="border border-dashed border-line py-16 text-center">
            <p className="font-serif text-xl">No orders yet</p>
            <p className="mt-2 text-sm text-mute">
              Your future wardrobe is still unwritten.
            </p>
            <Link to="/shop" className="btn-dark mt-6 px-8 py-3">
              Start Shopping
            </Link>
          </div>) : (orders.map((o) => (<div key={o.id} className="border border-line p-6 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="mt-1 text-xs text-mute">
                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })}{" "}
                    · {o.lines.reduce((a, l) => a + l.qty, 0)} item(s)
                  </p>
                </div>
                <span className="rounded-full bg-[#f4efe2] px-3.5 py-1.5 text-xs font-medium text-[#8a6d1f]">
                  {o.status}
                </span>
                <p className="font-serif text-lg">{money(o.total)}</p>
              </div>
              <div className="mt-4 flex gap-2">
                {o.lines.slice(0, 6).map((l, i) => (<img key={i} src={l.image} alt={l.name} title={l.name} className="h-14 w-11 rounded object-cover bg-[#f4f4f6]"/>))}
              </div>
            </div>)))}
      </div>
    </div>);
}
