import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserOrders } from "../services/orderApi";
function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const userName = useMemo(() => {
    if (!user) return "Member";

    if (user.name) return user.name;

    return (
      [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ") || "Member"
    );
  }, [user]);

  const initials = useMemo(() => {
    if (!userName) return "M";

    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [userName]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getUserOrders();

        if (!Array.isArray(data)) {
          console.error("Orders API response:", data);
          setOrders([]);
          return;
        }

        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      }
    };

    loadOrders();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#111111]">


      <section className="border-b border-[#deddd8] bg-[#f8f7f3]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">

          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a8881]">
            My Account
          </div>

          <h1 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Welcome back, {userName}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#77746d] sm:text-base">
            Manage your orders, update your profile, and explore your
            personalized FASCO account.
          </p>

        </div>
      </section>


      <section className="border-b border-[#deddd8] bg-[#f8f7f3]">

        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">

          <aside className="w-full border-b border-[#deddd8] lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r">

            <div className="p-6 lg:sticky lg:top-0 lg:min-h-[600px]">

              <div className="flex items-center gap-4 border-b border-[#deddd8] pb-6">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] font-serif text-lg text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-serif text-lg">
                    {userName}
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
                    className="flex items-center justify-between border-l-2 border-black bg-[#ecebe6] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em]"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/account"
                    className="flex items-center border-l-2 border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#68665f] transition hover:border-black hover:bg-[#ecebe6] hover:text-black"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/account"
                    className="flex items-center border-l-2 border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#68665f] transition hover:border-black hover:bg-[#ecebe6] hover:text-black"
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/account"
                    className="flex items-center border-l-2 border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#68665f] transition hover:border-black hover:bg-[#ecebe6] hover:text-black"
                  >
                    Addresses
                  </Link>

                  <Link
                    to="/account"
                    className="flex items-center border-l-2 border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#68665f] transition hover:border-black hover:bg-[#ecebe6] hover:text-black"
                  >
                    Account Settings
                  </Link>

                </div>

              </nav>

              <button
                type="button"
                onClick={logout}
                className="mt-10 border-t border-[#deddd8] pt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-[#68665f] transition hover:text-black"
              >
                Logout
              </button>

            </div>

          </aside>

          <main className="min-w-0 flex-1">

            <div className="p-5 sm:p-8 lg:p-10">

              <div className="grid gap-4 md:grid-cols-2">

                <div className="border border-[#deddd8] bg-white p-6">

                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                    Account
                  </div>

                  <h2 className="mt-3 font-serif text-3xl">
                    {userName}
                  </h2>

                  <p className="mt-2 break-all text-sm text-[#77746d]">
                    {user.email || "No email available"}
                  </p>

                  <Link
                    to="/account"
                    className="mt-6 inline-block border-b border-black pb-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                  >
                    View Profile
                  </Link>

                </div>

                <div className="bg-[#111111] p-6 text-white">

                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#b8b5ac]">
                    FASCO Member
                  </div>

                  <h2 className="mt-3 font-serif text-3xl">
                    Welcome
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#d4d1c8]">
                    Thank you for being part of the FASCO community.
                  </p>

                </div>

              </div>

              <div className="mt-10">

                <div className="mb-4 flex items-end justify-between border-b border-[#deddd8] pb-3">

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                      Your Activity
                    </div>

                    <h2 className="mt-1 font-serif text-3xl sm:text-4xl">
                      Order History
                    </h2>
                  </div>

                  {orders.length > 0 && (
                    <Link
                      to="/account"
                      className="hidden border-b border-black pb-1 text-[10px] font-medium uppercase tracking-[0.18em] sm:block"
                    >
                      View All
                    </Link>
                  )}

                </div>

                {orders.length === 0 ? (

                  <div className="border border-[#deddd8] bg-white px-6 py-16 text-center sm:px-10">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#deddd8] font-serif text-2xl">
                      {initials.charAt(0)}
                    </div>

                    <h3 className="mt-7 font-serif text-3xl">
                      No orders yet
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77746d]">
                      Your completed and recent orders will appear here once
                      you place your first order.
                    </p>

                    <Link
                      to="/shop"
                      className="mt-7 inline-flex bg-black px-7 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#2b2b2b]"
                    >
                      Explore Collection
                    </Link>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {orders.slice(0, 5).map((order, index) => (

                      <div
                        key={order._id || order.id || index}
                        className="flex flex-col gap-5 border border-[#deddd8] bg-white p-5 sm:flex-row sm:items-center"
                      >

                        <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-[#f2f1ed] font-serif text-2xl">
                          {order.productName?.charAt(0) || "F"}
                        </div>

                        <div className="flex-1">

                          <div className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                            Order #{order.orderNumber || order._id || index + 1}
                          </div>

                          <h3 className="mt-2 font-serif text-xl">
                            {order.productName || "FASCO Product"}
                          </h3>

                          <p className="mt-1 text-sm text-[#77746d]">
                            {order.status || "Processing"}
                          </p>

                        </div>

                        <div className="sm:text-right">

                          {order.total && (
                            <p className="font-serif text-xl">
                              ${order.total}
                            </p>
                          )}

                          <button
                            type="button"
                            className="mt-3 border-b border-black pb-1 text-[9px] font-medium uppercase tracking-[0.18em]"
                          >
                            Order Details
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

              <div className="mt-10">

                <div className="text-[10px] uppercase tracking-[0.25em] text-[#99968e]">
                  Personal Details
                </div>

                <h2 className="mt-1 font-serif text-3xl sm:text-4xl">
                  Account Information
                </h2>

                <div className="mt-4 grid border border-[#deddd8] bg-white md:grid-cols-2">

                  <div className="border-b border-[#deddd8] p-5 md:border-r">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                      Full Name
                    </div>

                    <p className="mt-2 text-sm">
                      {userName}
                    </p>
                  </div>

                  <div className="border-b border-[#deddd8] p-5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                      Email
                    </div>

                    <p className="mt-2 break-all text-sm">
                      {user.email || "Not available"}
                    </p>
                  </div>

                  <div className="p-5 md:border-r">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                      Member Status
                    </div>

                    <p className="mt-2 text-sm">
                      Active Member
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                      Account
                    </div>

                    <p className="mt-2 text-sm">
                      FASCO Customer
                    </p>
                  </div>

                </div>

              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">

                <div className="border border-[#deddd8] bg-white p-6">

                  <div className="flex items-center justify-between">

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#99968e]">
                        FASCO Rewards
                      </div>

                      <h3 className="mt-3 font-serif text-3xl">
                        0
                      </h3>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#99968e]">
                        Points Available
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black font-serif">
                      ★
                    </div>

                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full border border-black py-3 text-[9px] font-medium uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
                  >
                    Redeem
                  </button>

                </div>

                <div className="border border-[#deddd8] bg-white p-6">

                  <div className="flex items-center justify-between">

                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#99968e]">
                      Primary Address
                    </div>

                    <button
                      type="button"
                      className="text-sm"
                      aria-label="Edit address"
                    >
                      ↗
                    </button>

                  </div>

                  <h3 className="mt-4 font-serif text-2xl">
                    {userName}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#77746d]">
                    No primary address has been added yet.
                  </p>

                </div>

              </div>

            </div>

          </main>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;