import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/data";
import { Crumbs } from "../components/ui";
import { getUserOrders } from "../services/orderApi";

export default function Account() {
  const { user, logout, toast } = useStore();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "profile";
  const selectedOrder = searchParams.get("order");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      nav("/login", { replace: true });
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, nav]);

  if (!user) return null;

  const initials =
    `${user.firstName?.[0] || "F"}${user.lastName?.[0] || "A"}`.toUpperCase();

  const selected = orders.find(
    (order) => order.id === selectedOrder
  );

  const navClass = (name) =>
    `flex items-center border-l-2 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] transition ${section === name
      ? "border-black bg-[#ecebe6] text-black"
      : "border-transparent text-[#68665f] hover:border-black hover:bg-[#ecebe6] hover:text-black"
    }`;

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#111111]">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8 lg:px-10">
        <Crumbs items={[["Home", "/"], ["My Account"]]} />

        <div className="mt-8 flex flex-col border border-[#deddd8] bg-white lg:flex-row">
          <aside className="w-full border-b border-[#deddd8] lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r">
            <div className="p-6">
              <div className="flex items-center gap-4 border-b border-[#deddd8] pb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] font-serif text-lg text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-serif text-lg">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8a8881]">
                    FASCO Member
                  </p>
                </div>
              </div>

              <nav className="mt-6">
                <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#9a9891]">
                  Account
                </div>

                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    className="flex items-center border-l-2 border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#68665f] transition hover:border-black hover:bg-[#ecebe6] hover:text-black"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/account?section=profile"
                    className={navClass("profile")}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/account?section=orders"
                    className={navClass("orders")}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/account?section=addresses"
                    className={navClass("addresses")}
                  >
                    Addresses
                  </Link>

                  <Link
                    to="/account?section=settings"
                    className={navClass("settings")}
                  >
                    Account Settings
                  </Link>
                </div>
              </nav>

              <button
                type="button"
                onClick={() => {
                  logout();
                  toast("Signed out");
                  nav("/");
                }}
                className="mt-10 border-t border-[#deddd8] pt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-[#68665f] transition hover:text-black"
              >
                Logout
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="p-6 sm:p-8 lg:p-10">
              {section === "profile" && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                    Account
                  </div>

                  <h1 className="mt-2 font-serif text-4xl">
                    Profile
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-[#77746d]">
                    Manage your personal FASCO account information.
                  </p>

                  <div className="mt-8 grid border border-[#deddd8] bg-white md:grid-cols-2">
                    <div className="border-b border-[#deddd8] p-6 md:border-r">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Full Name
                      </p>

                      <p className="mt-3 font-serif text-2xl">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    <div className="border-b border-[#deddd8] p-6">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Email
                      </p>

                      <p className="mt-3 break-all text-sm">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-6 md:border-r">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Phone
                      </p>

                      <p className="mt-3 text-sm">
                        {user.phone || "Not available"}
                      </p>
                    </div>

                    <div className="p-6">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Membership
                      </p>

                      <p className="mt-3 text-sm">
                        FASCO Customer
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {section === "orders" && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                    Your Activity
                  </div>

                  <h1 className="mt-2 font-serif text-4xl">
                    My Orders
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-[#77746d]">
                    View your recent FASCO orders and order details.
                  </p>

                  {selected && (
                    <div className="mt-8 border border-[#deddd8] bg-white p-6">
                      <div className="flex items-center justify-between border-b border-[#deddd8] pb-5">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                            Order
                          </p>

                          <h2 className="mt-2 font-serif text-2xl">
                            #{selected.id}
                          </h2>
                        </div>

                        <span className="rounded-full bg-[#f4efe2] px-4 py-2 text-xs font-medium text-[#8a6d1f]">
                          {selected.status || "Processing"}
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        {selected.lines?.map((line, index) => (
                          <div
                            key={`${line.productId}-${index}`}
                            className="flex items-center gap-4 border-b border-[#eeeeea] pb-4"
                          >
                            <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#f4f4f1]">
                              {line.image ? (
                                <img
                                  src={line.image}
                                  alt={line.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : null}
                            </div>

                            <div className="flex-1">
                              <p className="font-serif text-lg">
                                {line.name}
                              </p>

                              <p className="mt-1 text-xs text-[#77746d]">
                                {line.color || "Default"} · Size{" "}
                                {line.size || "N/A"} · Qty {line.qty}
                              </p>
                            </div>

                            <p className="font-serif">
                              {money(
                                Number(line.price || 0) *
                                Number(line.qty || 0)
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 space-y-3 border-t border-[#deddd8] pt-5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#77746d]">Subtotal</span>
                          <span>{money(Number(selected.subtotal || 0))}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[#77746d]">Shipping</span>
                          <span>{money(Number(selected.shipping || 0))}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[#77746d]">Discount</span>
                          <span>
                            − {money(Number(selected.discount || 0))}
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-[#deddd8] pt-4 font-serif text-xl">
                          <span>Total</span>
                          <span>{money(Number(selected.total || 0))}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => nav("/account?section=orders")}
                        className="mt-6 border-b border-black pb-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                      >
                        Back To Orders
                      </button>
                    </div>
                  )}

                  {!selected && (
                    <div className="mt-8">
                      {loading ? (
                        <div className="border border-[#deddd8] bg-white py-16 text-center">
                          <p className="text-sm text-[#77746d]">
                            Loading your orders...
                          </p>
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="border border-dashed border-[#deddd8] bg-white py-16 text-center">
                          <p className="font-serif text-2xl">
                            No orders yet
                          </p>

                          <Link
                            to="/shop"
                            className="mt-6 inline-flex bg-black px-8 py-3 text-[10px] uppercase tracking-[0.2em] text-white"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div
                              key={order._id || order.id}
                              className="border border-[#deddd8] bg-white p-6"
                            >
                              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="flex gap-2">
                                  {order.lines?.slice(0, 3).map((line, index) => (
                                    <div
                                      key={index}
                                      className="h-20 w-16 overflow-hidden bg-[#f4f4f1]"
                                    >
                                      {line.image ? (
                                        <img
                                          src={line.image}
                                          alt={line.name || "Product"}
                                          className="h-full w-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center font-serif text-xl">
                                          F
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <div className="flex-1">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                                    Order
                                  </p>

                                  <h2 className="mt-2 font-serif text-xl">
                                    #{order.id}
                                  </h2>

                                  <p className="mt-1 text-sm text-[#77746d]">
                                    {order.lines?.length || 0} product(s)
                                  </p>
                                </div>

                                <div className="sm:text-right">
                                  <span className="rounded-full bg-[#f4efe2] px-3 py-1.5 text-xs text-[#8a6d1f]">
                                    {order.status || "Processing"}
                                  </span>

                                  <p className="mt-3 font-serif text-xl">
                                    {money(Number(order.total || 0))}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      nav(
                                        `/account?section=orders&order=${order.id}`
                                      )
                                    }
                                    className="mt-3 border-b border-black pb-1 text-[9px] uppercase tracking-[0.18em]"
                                  >
                                    Order Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {section === "addresses" && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                    Delivery
                  </div>

                  <h1 className="mt-2 font-serif text-4xl">
                    Addresses
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-[#77746d]">
                    Manage your saved delivery addresses.
                  </p>

                  <div className="mt-8 border border-[#deddd8] bg-white p-6">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                      Primary Address
                    </p>

                    <h2 className="mt-4 font-serif text-2xl">
                      {user.firstName} {user.lastName}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#77746d]">
                      No primary address has been added yet.
                    </p>
                  </div>
                </div>
              )}

              {section === "settings" && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                    Account
                  </div>

                  <h1 className="mt-2 font-serif text-4xl">
                    Account Settings
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-[#77746d]">
                    Manage your FASCO account settings.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="border border-[#deddd8] bg-white p-6">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Account Email
                      </p>

                      <p className="mt-3 break-all text-sm">
                        {user.email}
                      </p>
                    </div>

                    <div className="border border-[#deddd8] bg-white p-6">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Account Status
                      </p>

                      <p className="mt-3 text-sm">
                        Active
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        toast("Signed out");
                        nav("/");
                      }}
                      className="bg-black px-7 py-3 text-[10px] uppercase tracking-[0.2em] text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}