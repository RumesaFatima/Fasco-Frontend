import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAdminProfile,
    getDashboardStats,
} from "../services/adminAuthApi";

function AdminDashboard() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalReviews: 0,
    });

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [revenuePeriod, setRevenuePeriod] = useState("month");
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const profileData = await getAdminProfile();

                if (!profileData?.success) {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("admin");
                    navigate("/login");
                    return;
                }

                setAdmin(profileData.admin);

                const dashboardData = await getDashboardStats();

                if (!dashboardData?.success) {
                    throw new Error(
                        dashboardData?.message ||
                        "Failed to load dashboard data"
                    );
                }

                setStats({
                    totalUsers: Number(dashboardData.stats?.totalUsers || 0),
                    totalProducts: Number(dashboardData.stats?.totalProducts || 0),
                    totalOrders: Number(dashboardData.stats?.totalOrders || 0),
                    totalSales: Number(dashboardData.stats?.totalSales || 0),
                    pendingOrders: Number(dashboardData.stats?.pendingOrders || 0),
                    lowStockProducts: Number(
                        dashboardData.stats?.lowStockProducts || 0
                    ),
                    outOfStockProducts: Number(
                        dashboardData.stats?.outOfStockProducts || 0
                    ),
                    totalReviews: Number(
                        dashboardData.stats?.totalReviews || 0
                    ),
                });

                setOrders(
                    Array.isArray(dashboardData.orders)
                        ? dashboardData.orders
                        : []
                );

                setCustomers(
                    Array.isArray(dashboardData.customers)
                        ? dashboardData.customers
                        : []
                );

                setReviews(
                    Array.isArray(dashboardData.reviews)
                        ? dashboardData.reviews
                        : []
                );

                setProducts(
                    Array.isArray(dashboardData.products)
                        ? dashboardData.products
                        : []
                );
            } catch (error) {
                console.error("Admin dashboard error:", error);
                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/login");
    };

    const goTo = (section) => {
        document.getElementById(section)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const getProductStatus = (stock) => {
        const value = Number(stock || 0);

        if (value <= 0) return "Out of Stock";
        if (value <= 10) return "Low Stock";
        return "In Stock";
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return "—";

        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const getOrderCustomer = (order) =>
        order?.customerName ||
        order?.userName ||
        order?.name ||
        order?.customer?.name ||
        order?.user?.name ||
        order?.email ||
        order?.customerEmail ||
        "Customer";

    const getOrderProduct = (order) => {
        if (order?.productName) return order.productName;

        if (Array.isArray(order?.lines) && order.lines.length > 0) {
            return (
                order.lines[0]?.name ||
                order.lines[0]?.productName ||
                "Product"
            );
        }

        if (Array.isArray(order?.items) && order.items.length > 0) {
            return (
                order.items[0]?.name ||
                order.items[0]?.productName ||
                "Product"
            );
        }

        return "Product";
    };

    const getOrderAmount = (order) => {
        const amount = Number(
            order?.total ??
            order?.totalAmount ??
            order?.amount ??
            order?.grandTotal ??
            0
        );

        return `$${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`;
    };

    const displayOrders = orders.map((order) => ({
        id: order?._id || order?.id || "#ORDER",
        customer: getOrderCustomer(order),
        product: getOrderProduct(order),
        date: formatDate(order?.createdAt),
        amount: getOrderAmount(order),
        payment:
            order?.paymentStatus ||
            order?.payment?.status ||
            "Pending",
        status: order?.status || "Processing",
        raw: order,
    }));

    const openOrder = (order) => {
        setModal({
            type: "order",
            order,
        });
    };

    const openCustomers = () => {
        setModal({
            type: "customers",
        });
    };

    const openReviews = () => {
        setModal({
            type: "reviews",
        });
    };

    const openProducts = () => {
        setModal({
            type: "products",
        });
    };

    const revenueValue = Number(stats.totalSales || 0);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f7]">
                <p className="text-sm text-gray-500">
                    Loading admin dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#faf9f7] text-[#171717]">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                            Overview
                        </p>

                        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
                            Good Morning, {admin?.name || "Admin"}.
                        </h1>

                        <p className="mt-3 text-sm text-gray-500">
                            Here's what's happening with your FASCO store today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                            {new Date().toLocaleDateString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition hover:border-black hover:bg-black hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">Total Sales</p>

                        <p className="mt-3 font-serif text-2xl">
                            ${revenueValue.toLocaleString()}
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                            Real paid order revenue
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">Total Orders</p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.totalOrders}
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                            Real orders
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("customers")}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">
                            Total Customers
                        </p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.totalUsers}
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                            Real registered users
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={openProducts}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">
                            Total Products
                        </p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.totalProducts}
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                            Real database products
                        </p>
                    </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">
                            Pending Orders
                        </p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.pendingOrders}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("products")}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">
                            Low Stock Products
                        </p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.lowStockProducts}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={openReviews}
                        className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <p className="text-xs text-gray-500">
                            Total Reviews
                        </p>

                        <p className="mt-3 font-serif text-2xl">
                            {stats.totalReviews}
                        </p>
                    </button>
                </div>

                <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-serif text-xl">
                                Revenue Overview
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Real revenue calculated from paid orders.
                            </p>
                        </div>

                        <div className="flex gap-6 text-xs text-gray-500">
                            {["week", "month", "year"].map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() =>
                                        setRevenuePeriod(period)
                                    }
                                    className={
                                        revenuePeriod === period
                                            ? "border-b border-black pb-1 font-medium text-black"
                                            : "transition hover:text-black"
                                    }
                                >
                                    {period === "week"
                                        ? "This Week"
                                        : period === "month"
                                            ? "This Month"
                                            : "This Year"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-7">
                        <p className="text-[11px] text-gray-500">
                            Total Revenue
                        </p>

                        <p className="mt-1 font-serif text-3xl">
                            ${revenueValue.toLocaleString()}
                        </p>

                        <div className="mt-7 h-[220px] overflow-hidden">
                            <div className="flex h-full items-end gap-2">
                                {displayOrders.length > 0 ? (
                                    displayOrders
                                        .slice(0, 12)
                                        .reverse()
                                        .map((order, index) => {
                                            const amount = Number(
                                                order.raw?.total ??
                                                order.raw?.totalAmount ??
                                                order.raw?.amount ??
                                                order.raw?.grandTotal ??
                                                0
                                            );

                                            const max = Math.max(
                                                ...displayOrders
                                                    .slice(0, 12)
                                                    .map((item) =>
                                                        Number(
                                                            item.raw?.total ??
                                                            item.raw?.totalAmount ??
                                                            item.raw?.amount ??
                                                            item.raw?.grandTotal ??
                                                            0
                                                        )
                                                    ),
                                                1
                                            );

                                            const height = Math.max(
                                                8,
                                                (amount / max) * 100
                                            );

                                            return (
                                                <div
                                                    key={`${order.id}-${index}`}
                                                    className="flex h-full flex-1 items-end"
                                                >
                                                    <div
                                                        className="w-full rounded-t bg-black"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                        title={`${order.date} - ${order.amount}`}
                                                    />
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                        No order revenue data available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="orders"
                    className="mt-5 scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <h2 className="font-serif text-xl">
                            Recent Orders
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({ type: "orders" })
                            }
                            className="text-xs font-medium transition hover:underline"
                        >
                            View All Orders
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-xs">
                            <thead className="bg-[#faf9f7] text-[10px] uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Payment</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {displayOrders.length > 0 ? (
                                    displayOrders.slice(0, 5).map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition hover:bg-[#faf9f7]"
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                {order.id}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order.customer}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order.product}
                                            </td>

                                            <td className="px-4 py-4 text-gray-500">
                                                {order.date}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order.amount}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px]">
                                                    {order.payment}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px]">
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openOrder(order)
                                                    }
                                                    className="text-gray-500 hover:text-black hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-10 text-center text-sm text-gray-400"
                                        >
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section
                    id="products"
                    className="mt-5 scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <h2 className="font-serif text-xl">
                            Products
                        </h2>

                        <button
                            type="button"
                            onClick={openProducts}
                            className="text-xs font-medium hover:underline"
                        >
                            View All Products
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-xs">
                            <thead className="bg-[#faf9f7] text-[10px] uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date Added</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.length > 0 ? (
                                    products.slice(0, 10).map((product) => {
                                        const stock = Number(
                                            product.stock ?? 0
                                        );

                                        const status =
                                            getProductStatus(stock);

                                        return (
                                            <tr
                                                key={
                                                    product._id ||
                                                    product.id
                                                }
                                                className="transition hover:bg-[#faf9f7]"
                                            >
                                                <td className="px-4 py-4 font-medium">
                                                    {product.name ||
                                                        product.title ||
                                                        "Product"}
                                                </td>

                                                <td className="px-4 py-4 text-gray-500">
                                                    {product.category || "—"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    $
                                                    {Number(
                                                        product.price ?? 0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {stock}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded px-2 py-1 text-[10px] ${status ===
                                                                "In Stock"
                                                                ? "bg-green-50 text-green-700"
                                                                : status ===
                                                                    "Low Stock"
                                                                    ? "bg-yellow-50 text-yellow-700"
                                                                    : "bg-red-50 text-red-600"
                                                            }`}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 text-gray-500">
                                                    {formatDate(
                                                        product.createdAt
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-10 text-center text-sm text-gray-400"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section
                    id="customers"
                    className="mt-5 scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-xl">
                                Customers
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Real customer data from your database.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCustomers}
                            className="text-xs font-medium hover:underline"
                        >
                            View All Customers
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="border border-gray-100 p-5">
                            <p className="text-xs text-gray-500">
                                Total Customers
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                                {stats.totalUsers}
                            </p>
                        </div>

                        <div className="border border-gray-100 p-5">
                            <p className="text-xs text-gray-500">
                                Customers Loaded
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                                {customers.length}
                            </p>
                        </div>

                        <div className="border border-gray-100 p-5">
                            <p className="text-xs text-gray-500">
                                Reviews
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                                {stats.totalReviews}
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="reviews"
                    className="mt-5 scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <h2 className="font-serif text-xl">
                            Recent Reviews
                        </h2>

                        <button
                            type="button"
                            onClick={openReviews}
                            className="text-xs font-medium hover:underline"
                        >
                            View All Reviews
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {reviews.length > 0 ? (
                            reviews.slice(0, 5).map((review) => (
                                <div
                                    key={
                                        review._id ||
                                        `${review.productId}-${review.createdAt}`
                                    }
                                    className="grid gap-3 p-5 transition hover:bg-[#faf9f7] md:grid-cols-[150px_180px_110px_1fr_110px]"
                                >
                                    <div>
                                        <p className="text-xs font-medium">
                                            {review.customerName ||
                                                review.userName ||
                                                "Customer"}
                                        </p>

                                        <p className="mt-1 text-[10px] text-gray-400">
                                            {review.customerEmail || ""}
                                        </p>
                                    </div>

                                    <p className="text-xs">
                                        {review.productName || "Product"}
                                    </p>

                                    <p className="text-sm tracking-wide">
                                        {"★".repeat(
                                            Math.min(
                                                Number(review.rating || 0),
                                                5
                                            )
                                        )}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {review.comment || ""}
                                    </p>

                                    <p className="text-[10px] text-gray-400">
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-sm text-gray-400">
                                No reviews found.
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                    <div>
                        <p className="text-xs text-gray-400">
                            Logged in as
                        </p>

                        <p className="mt-1 text-sm font-medium">
                            {admin?.email}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm text-gray-500 transition hover:text-black hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <AdminModal
                modal={modal}
                setModal={setModal}
                customers={customers}
                reviews={reviews}
                products={products}
                displayOrders={displayOrders}
            />
        </div>
    );
}

function AdminModal({
    modal,
    setModal,
    customers,
    reviews,
    products,
    displayOrders,
}) {
    if (!modal) return null;

    const close = () => setModal(null);

    const formatDate = (date) => {
        if (!date) return "—";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return "—";

        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    if (modal.type === "order") {
        const order = modal.order;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[520px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <p className="text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        Order Details
                    </h2>

                    <div className="mt-6 space-y-3 border border-[#eeeae5] p-4 text-xs">
                        <div className="flex justify-between gap-4">
                            <span>Order ID</span>
                            <span>{order?.id}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Customer</span>
                            <span>{order?.customer}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Product</span>
                            <span>{order?.product}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Date</span>
                            <span>{order?.date}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Amount</span>
                            <span>{order?.amount}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Payment</span>
                            <span>{order?.payment}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Status</span>
                            <span>{order?.status}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="mt-6 h-10 w-full bg-black text-[10px] font-medium text-white"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    let title = "";
    let description = "";
    let rows = [];

    if (modal.type === "customers") {
        title = "Customers";
        description = "Real customers from the database.";

        rows = customers.map((customer) => [
            customer.name || customer.username || "Customer",
            customer.email || "—",
            customer.createdAt
                ? formatDate(customer.createdAt)
                : "—",
        ]);
    }

    if (modal.type === "reviews") {
        title = "All Reviews";
        description = "Real customer reviews from the database.";

        rows = reviews.map((review) => [
            review.customerName || review.userName || "Customer",
            review.productName || "Product",
            review.rating ? `${Number(review.rating)}/5` : "—",
        ]);
    }

    if (modal.type === "products") {
        title = "All Products";
        description = "Real products from the database.";

        rows = products.map((product) => [
            product.name || product.title || "Product",
            product.category || "—",
            `$${Number(product.price ?? 0).toFixed(2)}`,
            String(product.stock ?? 0),
        ]);
    }

    if (modal.type === "orders") {
        title = "All Orders";
        description = "Real orders from the database.";

        rows = displayOrders.map((order) => [
            order.id,
            order.customer,
            order.amount,
        ]);
    }

    if (
        ["customers", "reviews", "products", "orders"].includes(
            modal.type
        )
    ) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[800px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <p className="text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        {title}
                    </h2>

                    <p className="mt-2 text-center text-xs text-[#77736d]">
                        {description}
                    </p>

                    <div className="mt-6 max-h-[60vh] overflow-auto border border-[#eeeae5]">
                        {rows.length > 0 ? (
                            rows.map((row, index) => (
                                <div
                                    key={`${row.join("-")}-${index}`}
                                    className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-[#eeeae5] px-4 py-3 text-xs last:border-b-0"
                                >
                                    {row.map((value, valueIndex) => (
                                        <span
                                            key={valueIndex}
                                            className={
                                                valueIndex ===
                                                    row.length - 1
                                                    ? "text-right text-[#77736d]"
                                                    : ""
                                            }
                                        >
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-gray-400">
                                No data found.
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="mt-6 h-10 w-full bg-black text-[10px] font-medium text-white"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default AdminDashboard;