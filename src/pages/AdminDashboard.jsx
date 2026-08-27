import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminProfile,
    getDashboardStats,
} from "../services/adminAuthApi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    const icons = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        orders: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
            </>
        ),

        products: (
            <>
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.5 7.5 4 7.5-4" />
                <path d="M12 11.5V21" />
            </>
        ),

        customers: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20c.7-3.3 2.7-5 5.5-5s4.8 1.7 5.5 5" />
                <path d="M16 11c2.4.2 4 1.7 4.5 4" />
                <path d="M16 5.5a2.5 2.5 0 0 1 0 5" />
            </>
        ),

        reviews: (
            <>
                <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
            </>
        ),

        money: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10" />
                <path d="M15 9.5c-.7-.8-1.7-1.2-3-1.2-1.6 0-2.7.8-2.7 2 0 3.2 5.7 1.4 5.7 4.3 0 1.2-1.1 2-2.8 2-1.4 0-2.5-.5-3.2-1.3" />
            </>
        ),

        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),

        warning: (
            <>
                <path d="M12 3 2.8 20h18.4L12 3Z" />
                <path d="M12 9v5" />
                <path d="M12 17h.01" />
            </>
        ),

        eye: (
            <>
                <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" />
                <circle cx="12" cy="12" r="2.3" />
            </>
        ),

        edit: (
            <>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
            </>
        ),

        search: (
            <>
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
            </>
        ),

        plus: (
            <>
                <path d="M12 5v14M5 12h14" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        refresh: (
            <>
                <path d="M20 11a8.1 8.1 0 0 0-14.5-4.9L4 8" />
                <path d="M4 4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 14.5 4.9L20 16" />
                <path d="M20 20v-4h-4" />
            </>
        ),
    };

    return <svg {...common}>{icons[name] || null}</svg>;
}

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function formatMoney(value) {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount)) {
        return "$0.00";
    }

    return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function getProductImage(product) {
    return (
        product?.image ||
        product?.imageUrl ||
        product?.thumbnail ||
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        product?.photo ||
        ""
    );
}

function getUserImage(user) {
    return (
        user?.avatar ||
        user?.avatarUrl ||
        user?.profileImage ||
        user?.image ||
        user?.photo ||
        ""
    );
}

function getOrderCustomer(order) {
    return (
        order?.customerName ||
        order?.userName ||
        order?.name ||
        order?.customer?.name ||
        order?.user?.name ||
        order?.email ||
        order?.customerEmail ||
        "Customer"
    );
}

function getOrderCustomerImage(order) {
    return (
        order?.customer?.avatar ||
        order?.customer?.image ||
        order?.user?.avatar ||
        order?.user?.image ||
        order?.customerImage ||
        order?.userImage ||
        ""
    );
}

function getOrderProduct(order) {
    if (order?.productName) {
        return order.productName;
    }

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
}

function getOrderProductImage(order) {
    if (order?.productImage) return order.productImage;
    if (order?.image) return order.image;

    if (Array.isArray(order?.lines) && order.lines.length > 0) {
        return (
            order.lines[0]?.image ||
            order.lines[0]?.imageUrl ||
            order.lines[0]?.productImage ||
            ""
        );
    }

    if (Array.isArray(order?.items) && order.items.length > 0) {
        return (
            order.items[0]?.image ||
            order.items[0]?.imageUrl ||
            order.items[0]?.productImage ||
            ""
        );
    }

    return "";
}

function getOrderAmount(order) {
    const amount = Number(
        order?.total ??
        order?.totalAmount ??
        order?.amount ??
        order?.grandTotal ??
        0
    );

    return Number.isFinite(amount) ? amount : 0;
}

function getPaymentStatus(order) {
    return (
        order?.paymentStatus ||
        order?.payment?.status ||
        order?.payment_status ||
        "Pending"
    );
}

function getOrderStatus(order) {
    return order?.status || order?.orderStatus || "Processing";
}

function getProductStock(product) {
    return Number(
        product?.stock ??
        product?.quantity ??
        product?.inventory ??
        0
    );
}

function getProductStatus(stock) {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
}

function getStatusClass(status) {
    const value = String(status || "").toLowerCase();

    if (
        value.includes("paid") ||
        value.includes("delivered") ||
        value.includes("published") ||
        value.includes("in stock") ||
        value.includes("shipped") ||
        value.includes("completed")
    ) {
        return "bg-[#edf7ee] text-[#3d7a48]";
    }

    if (
        value.includes("processing") ||
        value.includes("pending") ||
        value.includes("low stock")
    ) {
        return "bg-[#fff5df] text-[#a86d05]";
    }

    if (
        value.includes("unpaid") ||
        value.includes("failed") ||
        value.includes("cancelled") ||
        value.includes("out of stock")
    ) {
        return "bg-[#fff0ee] text-[#c64e43]";
    }

    return "bg-[#f3f3f1] text-[#666]";
}

function AdminDashboard() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
    const [revenue, setRevenue] = useState([]);

    const [revenuePeriod, setRevenuePeriod] = useState("month");
    const [modal, setModal] = useState(null);

    const loadDashboard = async (isRefresh = false) => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/login");
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
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
                totalUsers: Number(
                    dashboardData.stats?.totalUsers || 0
                ),

                totalProducts: Number(
                    dashboardData.stats?.totalProducts || 0
                ),

                totalOrders: Number(
                    dashboardData.stats?.totalOrders || 0
                ),

                totalSales: Number(
                    dashboardData.stats?.totalSales || 0
                ),

                pendingOrders: Number(
                    dashboardData.stats?.pendingOrders || 0
                ),

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

            setRevenue(
                Array.isArray(dashboardData.revenue)
                    ? dashboardData.revenue
                    : []
            );
        } catch (error) {
            console.error(
                "Admin dashboard error:",
                error
            );

            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            navigate("/login");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/login");
    };

    const displayOrders = useMemo(() => {
        return orders.map((order) => ({
            id:
                order?._id ||
                order?.id ||
                order?.orderId ||
                "#ORDER",

            customer: getOrderCustomer(order),

            customerImage:
                getOrderCustomerImage(order),

            product: getOrderProduct(order),

            productImage:
                getOrderProductImage(order),

            date: formatDate(
                order?.createdAt ||
                order?.orderDate ||
                order?.date
            ),

            amount: getOrderAmount(order),

            payment: getPaymentStatus(order),

            status: getOrderStatus(order),

            raw: order,
        }));
    }, [orders]);


    const todaySales = useMemo(() => {
        const today = new Date();

        return orders.reduce((total, order) => {
            const date = new Date(
                order?.createdAt ||
                order?.orderDate ||
                order?.date
            );

            if (
                Number.isNaN(date.getTime()) ||
                date.toDateString() !==
                today.toDateString()
            ) {
                return total;
            }

            const payment = String(
                getPaymentStatus(order)
            ).toLowerCase();

            if (
                payment.includes("unpaid") ||
                payment.includes("failed") ||
                payment.includes("cancel")
            ) {
                return total;
            }

            return (
                total +
                getOrderAmount(order)
            );
        }, 0);
    }, [orders]);


    const weeklySales = useMemo(() => {
        const now = new Date();
        const start = new Date(now);

        start.setDate(
            now.getDate() - now.getDay()
        );

        start.setHours(0, 0, 0, 0);

        return orders.reduce((total, order) => {
            const date = new Date(
                order?.createdAt ||
                order?.orderDate ||
                order?.date
            );

            if (
                Number.isNaN(date.getTime()) ||
                date < start
            ) {
                return total;
            }

            const payment = String(
                getPaymentStatus(order)
            ).toLowerCase();

            if (
                payment.includes("unpaid") ||
                payment.includes("failed") ||
                payment.includes("cancel")
            ) {
                return total;
            }

            return (
                total +
                getOrderAmount(order)
            );
        }, 0);
    }, [orders]);


    const filteredRevenue = useMemo(() => {
        if (!Array.isArray(revenue)) {
            return [];
        }

        if (revenuePeriod === "week") {
            return revenue.slice(-7);
        }

        const now = new Date();

        if (revenuePeriod === "month") {
            return revenue.filter((item) => {
                const value = String(
                    item?.month ||
                    item?.date ||
                    item?.period ||
                    ""
                );

                if (!value) return false;

                const parts =
                    value.split("-");

                if (parts.length < 2) {
                    return false;
                }

                const year =
                    Number(parts[0]);

                const month =
                    Number(parts[1]);

                return (
                    year ===
                    now.getFullYear() &&
                    month ===
                    now.getMonth() + 1
                );
            });
        }

        if (revenuePeriod === "year") {
            return revenue.filter((item) => {
                const value = String(
                    item?.month ||
                    item?.date ||
                    item?.period ||
                    ""
                );

                return value.startsWith(
                    String(now.getFullYear())
                );
            });
        }

        return revenue;
    }, [revenue, revenuePeriod]);

    const chartData = useMemo(() => {
        if (filteredRevenue.length > 0) {
            return filteredRevenue;
        }

        return revenue.slice(-7);
    }, [filteredRevenue, revenue]);

    const periodRevenue = useMemo(() => {
        return filteredRevenue.reduce(
            (total, item) => {
                const amount = Number(
                    item?.amount ??
                    item?.revenue ??
                    item?.total ??
                    0
                );

                return (
                    total +
                    (Number.isFinite(amount)
                        ? amount
                        : 0)
                );
            },
            0
        );
    }, [filteredRevenue]);


    const chartPoints = useMemo(() => {
        if (!chartData.length) {
            return "";
        }

        const width = 900;
        const height = 280;
        const paddingX = 30;
        const paddingY = 25;

        const amounts = chartData.map(
            (item) =>
                Number(
                    item?.amount ??
                    item?.revenue ??
                    item?.total ??
                    0
                )
        );

        const max = Math.max(
            ...amounts,
            1
        );

        return chartData
            .map((item, index) => {
                const amount =
                    Number(
                        item?.amount ??
                        item?.revenue ??
                        item?.total ??
                        0
                    );

                const x =
                    chartData.length === 1
                        ? width / 2
                        : paddingX +
                        (index /
                            (chartData.length -
                                1)) *
                        (width -
                            paddingX *
                            2);

                const y =
                    height -
                    paddingY -
                    (amount / max) *
                    (height -
                        paddingY * 2);

                return `${x},${y}`;
            })
            .join(" ");
    }, [chartData]);

    const revenueLabels = useMemo(() => {
        return chartData.map((item) => {
            const value = String(
                item?.month ||
                item?.date ||
                item?.period ||
                ""
            );

            if (!value) return "—";

            const parsed = new Date(
                value.length === 7
                    ? `${value}-01`
                    : value
            );

            if (
                !Number.isNaN(
                    parsed.getTime()
                )
            ) {
                return parsed.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                    }
                );
            }

            return value;
        });
    }, [chartData]);

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f7]">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

                        <p className="mt-4 text-xs text-gray-500">
                            Loading FASCO Admin Dashboard...
                        </p>
                    </div>
                </div>

                <Footer />
            </>
        );
    }


    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-[#faf9f7] text-[#171717]">
                <main className="mx-auto w-full max-w-[1450px] px-5 py-8 sm:px-7 lg:px-10 xl:px-12">


                    <section className="mb-8">
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#aaa49d]">
                                    FASCO ADMIN
                                </p>

                                <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-[40px]">
                                    Good Morning,{" "}
                                    {admin?.name ||
                                        admin?.username ||
                                        "Admin"}
                                    .
                                </h1>

                                <p className="mt-2 max-w-xl text-xs leading-5 text-gray-500">
                                    Manage your store,
                                    monitor orders,
                                    products, customers
                                    and real sales data
                                    from one place.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    loadDashboard(true)
                                }
                                disabled={refreshing}
                                className="flex w-fit items-center gap-2 rounded-md border border-[#e4dfd9] bg-white px-4 py-2.5 text-[10px] transition hover:bg-[#f5f3f0] disabled:opacity-50"
                            >
                                <Icon
                                    name="refresh"
                                    size={13}
                                />

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh Data"}
                            </button>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "orders",
                                })
                            }
                            className="group rounded-md border border-[#e6e1db] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                                    <Icon
                                        name="money"
                                        size={16}
                                    />
                                </span>

                                <span className="text-[9px] text-gray-400">
                                    REAL DATA
                                </span>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-500">
                                Total Sales
                            </p>

                            <p className="mt-1 font-serif text-2xl">
                                {formatMoney(
                                    stats.totalSales
                                )}
                            </p>

                            <p className="mt-2 text-[9px] text-gray-400">
                                Paid order revenue
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "orders",
                                })
                            }
                            className="group rounded-md border border-[#e6e1db] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2efeb]">
                                    <Icon
                                        name="orders"
                                        size={16}
                                    />
                                </span>

                                <span className="text-[9px] text-gray-400">
                                    DATABASE
                                </span>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-500">
                                Total Orders
                            </p>

                            <p className="mt-1 font-serif text-2xl">
                                {stats.totalOrders.toLocaleString()}
                            </p>

                            <p className="mt-2 text-[9px] text-gray-400">
                                Real orders
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "customers",
                                })
                            }
                            className="group rounded-md border border-[#e6e1db] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2efeb]">
                                    <Icon
                                        name="customers"
                                        size={16}
                                    />
                                </span>

                                <span className="text-[9px] text-gray-400">
                                    DATABASE
                                </span>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-500">
                                Total Customers
                            </p>

                            <p className="mt-1 font-serif text-2xl">
                                {stats.totalUsers.toLocaleString()}
                            </p>

                            <p className="mt-2 text-[9px] text-gray-400">
                                Registered users
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "products",
                                })
                            }
                            className="group rounded-md border border-[#e6e1db] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2efeb]">
                                    <Icon
                                        name="products"
                                        size={16}
                                    />
                                </span>

                                <span className="text-[9px] text-gray-400">
                                    DATABASE
                                </span>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-500">
                                Total Products
                            </p>

                            <p className="mt-1 font-serif text-2xl">
                                {stats.totalProducts.toLocaleString()}
                            </p>

                            <p className="mt-2 text-[9px] text-gray-400">
                                Active database products
                            </p>
                        </button>
                    </section>

                    <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-md border border-[#e6e1db] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="clock"
                                    size={18}
                                />

                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        Pending Orders
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {stats.pendingOrders.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border border-[#e6e1db] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="warning"
                                    size={18}
                                />

                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        Low Stock
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {stats.lowStockProducts.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border border-[#e6e1db] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="products"
                                    size={18}
                                />

                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        Out of Stock
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {stats.outOfStockProducts.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border border-[#e6e1db] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="reviews"
                                    size={18}
                                />

                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        Reviews
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {stats.totalReviews.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mt-5 rounded-md border border-[#e6e1db] bg-white p-5 sm:p-7">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.22em] text-[#aaa49d]">
                                    Analytics
                                </p>

                                <h2 className="mt-2 font-serif text-xl">
                                    Revenue Overview
                                </h2>

                                <p className="mt-1 text-[10px] text-gray-500">
                                    Revenue based on real paid
                                    orders returned by your
                                    backend.
                                </p>
                            </div>

                            <div className="flex gap-5">
                                {[
                                    ["week", "Week"],
                                    ["month", "Month"],
                                    ["year", "Year"],
                                ].map(
                                    ([period, label]) => (
                                        <button
                                            key={period}
                                            type="button"
                                            onClick={() =>
                                                setRevenuePeriod(
                                                    period
                                                )
                                            }
                                            className={`pb-1 text-[10px] transition ${revenuePeriod ===
                                                period
                                                ? "border-b border-black font-medium text-black"
                                                : "text-gray-400 hover:text-black"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">

                            <div className="grid grid-cols-2 gap-5 lg:block lg:space-y-6">
                                <div>
                                    <p className="text-[9px] text-gray-500">
                                        Total Revenue
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {formatMoney(
                                            stats.totalSales
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] text-gray-500">
                                        Today
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {formatMoney(
                                            todaySales
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] text-gray-500">
                                        This Week
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {formatMoney(
                                            weeklySales
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] text-gray-500">
                                        Selected Period
                                    </p>

                                    <p className="mt-1 font-serif text-xl">
                                        {formatMoney(
                                            filteredRevenue.length
                                                ? periodRevenue
                                                : 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="relative h-[280px]">

                                    {chartData.length > 0 ? (
                                        <>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                                                {[0, 1, 2, 3, 4].map(
                                                    (line) => (
                                                        <div
                                                            key={line}
                                                            className="h-px w-full bg-[#efede9]"
                                                        />
                                                    )
                                                )}
                                            </div>

                                            <svg
                                                className="absolute inset-0 h-full w-full"
                                                viewBox="0 0 900 280"
                                                preserveAspectRatio="none"
                                            >
                                                <polyline
                                                    points={
                                                        chartPoints
                                                    }
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    vectorEffect="non-scaling-stroke"
                                                />

                                                {chartData.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => {
                                                        const amounts =
                                                            chartData.map(
                                                                (
                                                                    current
                                                                ) =>
                                                                    Number(
                                                                        current?.amount ??
                                                                        current?.revenue ??
                                                                        current?.total ??
                                                                        0
                                                                    )
                                                            );

                                                        const max =
                                                            Math.max(
                                                                ...amounts,
                                                                1
                                                            );

                                                        const amount =
                                                            Number(
                                                                item?.amount ??
                                                                item?.revenue ??
                                                                item?.total ??
                                                                0
                                                            );

                                                        const width =
                                                            900;

                                                        const height =
                                                            280;

                                                        const paddingX =
                                                            30;

                                                        const paddingY =
                                                            25;

                                                        const x =
                                                            chartData.length ===
                                                                1
                                                                ? width /
                                                                2
                                                                : paddingX +
                                                                (index /
                                                                    (chartData.length -
                                                                        1)) *
                                                                (width -
                                                                    paddingX *
                                                                    2);

                                                        const y =
                                                            height -
                                                            paddingY -
                                                            (amount /
                                                                max) *
                                                            (height -
                                                                paddingY *
                                                                2);

                                                        return (
                                                            <circle
                                                                key={
                                                                    index
                                                                }
                                                                cx={
                                                                    x
                                                                }
                                                                cy={
                                                                    y
                                                                }
                                                                r="3.5"
                                                                fill="white"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            />
                                                        );
                                                    }
                                                )}
                                            </svg>

                                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-gray-400">
                                                {revenueLabels.map(
                                                    (
                                                        label,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={`${label}-${index}`}
                                                        >
                                                            {
                                                                label
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center border border-dashed border-[#e5e0da] text-xs text-gray-400">
                                            No revenue data
                                            available from
                                            backend.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5 overflow-hidden rounded-md border border-[#e6e1db] bg-white">

                        <div className="flex items-center justify-between border-b border-[#eeeae5] px-5 py-5">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#aaa49d]">
                                    Orders
                                </p>

                                <h2 className="mt-1 font-serif text-xl">
                                    Recent Orders
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setModal({
                                        type: "orders",
                                    })
                                }
                                className="flex items-center gap-2 text-[10px] font-medium hover:underline"
                            >
                                View All
                                <Icon
                                    name="arrow"
                                    size={12}
                                />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-[#faf9f7]">
                                    <tr className="text-[9px] uppercase tracking-wide text-gray-500">
                                        <th className="px-5 py-3">
                                            Order
                                        </th>

                                        <th className="px-5 py-3">
                                            Customer
                                        </th>

                                        <th className="px-5 py-3">
                                            Product
                                        </th>

                                        <th className="px-5 py-3">
                                            Date
                                        </th>

                                        <th className="px-5 py-3">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3">
                                            Payment
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                        <th className="px-5 py-3">
                                            View
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f0ede9]">
                                    {displayOrders.length ? (
                                        displayOrders
                                            .slice(0, 5)
                                            .map(
                                                (
                                                    order
                                                ) => (
                                                    <tr
                                                        key={
                                                            order.id
                                                        }
                                                        className="text-[9px] transition hover:bg-[#faf9f7]"
                                                    >
                                                        <td className="px-5 py-4 font-medium">
                                                            {order.id}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {order.customerImage ? (
                                                                    <img
                                                                        src={
                                                                            order.customerImage
                                                                        }
                                                                        alt=""
                                                                        className="h-7 w-7 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0ede9] text-[8px] font-medium">
                                                                        {order.customer
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase()}
                                                                    </div>
                                                                )}

                                                                <span className="whitespace-nowrap">
                                                                    {
                                                                        order.customer
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {order.productImage ? (
                                                                    <img
                                                                        src={
                                                                            order.productImage
                                                                        }
                                                                        alt=""
                                                                        className="h-9 w-8 rounded-sm object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-9 w-8 items-center justify-center rounded-sm bg-[#f5f3f0]">
                                                                        <Icon
                                                                            name="products"
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}

                                                                <span className="max-w-[150px] truncate">
                                                                    {
                                                                        order.product
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4 text-gray-500">
                                                            {
                                                                order.date
                                                            }
                                                        </td>

                                                        <td className="px-5 py-4 font-medium">
                                                            {formatMoney(
                                                                order.amount
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`rounded px-2 py-1 text-[8px] ${getStatusClass(
                                                                    order.payment
                                                                )}`}
                                                            >
                                                                {
                                                                    order.payment
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`rounded px-2 py-1 text-[8px] ${getStatusClass(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {
                                                                    order.status
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setModal(
                                                                        {
                                                                            type: "order",
                                                                            order,
                                                                        }
                                                                    )
                                                                }
                                                                className="flex items-center gap-1 text-gray-500 hover:text-black"
                                                            >
                                                                <Icon
                                                                    name="eye"
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-5 py-12 text-center text-xs text-gray-400"
                                            >
                                                No orders found
                                                in the database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mt-5 overflow-hidden rounded-md border border-[#e6e1db] bg-white">

                        <div className="flex flex-col justify-between gap-3 border-b border-[#eeeae5] px-5 py-5 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#aaa49d]">
                                    Catalog
                                </p>

                                <h2 className="mt-1 font-serif text-xl">
                                    Products
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setModal({
                                            type: "products",
                                        })
                                    }
                                    className="text-[10px] font-medium hover:underline"
                                >
                                    View All
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/products"
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-md bg-black px-4 py-2.5 text-[9px] font-medium text-white transition hover:bg-[#222]"
                                >
                                    <Icon
                                        name="plus"
                                        size={12}
                                    />

                                    Add Product
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="bg-[#faf9f7]">
                                    <tr className="text-[9px] uppercase tracking-wide text-gray-500">
                                        <th className="px-5 py-3">
                                            Product
                                        </th>

                                        <th className="px-5 py-3">
                                            Category
                                        </th>

                                        <th className="px-5 py-3">
                                            Price
                                        </th>

                                        <th className="px-5 py-3">
                                            Stock
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                        <th className="px-5 py-3">
                                            Added
                                        </th>

                                        <th className="px-5 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f0ede9]">
                                    {products.length ? (
                                        products
                                            .slice(0, 5)
                                            .map(
                                                (
                                                    product
                                                ) => {
                                                    const stock =
                                                        getProductStock(
                                                            product
                                                        );

                                                    const status =
                                                        getProductStatus(
                                                            stock
                                                        );

                                                    const image =
                                                        getProductImage(
                                                            product
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                product._id ||
                                                                product.id
                                                            }
                                                            className="text-[9px] transition hover:bg-[#faf9f7]"
                                                        >
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {image ? (
                                                                        <img
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt={
                                                                                product.name ||
                                                                                product.title ||
                                                                                "Product"
                                                                            }
                                                                            className="h-11 w-9 rounded-sm bg-[#f5f3f0] object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-11 w-9 items-center justify-center rounded-sm bg-[#f5f3f0]">
                                                                            <Icon
                                                                                name="products"
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    <span className="font-medium">
                                                                        {product.name ||
                                                                            product.title ||
                                                                            "Product"}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 text-gray-500">
                                                                {product.category ||
                                                                    product.categoryName ||
                                                                    "—"}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                {formatMoney(
                                                                    product.price
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                {stock}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={`rounded px-2 py-1 text-[8px] ${getStatusClass(
                                                                        status
                                                                    )}`}
                                                                >
                                                                    {
                                                                        status
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td className="px-5 py-4 text-gray-500">
                                                                {formatDate(
                                                                    product.createdAt
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/admin/products/edit/${product._id ||
                                                                            product.id
                                                                            }`
                                                                        )
                                                                    }
                                                                    className="text-gray-500 transition hover:text-black"
                                                                    title="Edit Product"
                                                                >
                                                                    <Icon
                                                                        name="edit"
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-5 py-12 text-center text-xs text-gray-400"
                                            >
                                                No products found
                                                in the database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">

                        <section className="rounded-md border border-[#e6e1db] bg-white p-5">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#aaa49d]">
                                        Users
                                    </p>

                                    <h2 className="mt-1 font-serif text-xl">
                                        Customers
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setModal({
                                            type: "customers",
                                        })
                                    }
                                    className="text-[10px] font-medium hover:underline"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="mt-6 space-y-1">
                                {customers.length ? (
                                    customers
                                        .slice(0, 5)
                                        .map(
                                            (
                                                customer
                                            ) => {
                                                const image =
                                                    getUserImage(
                                                        customer
                                                    );

                                                const name =
                                                    customer?.name ||
                                                    customer?.username ||
                                                    "Customer";

                                                return (
                                                    <div
                                                        key={
                                                            customer._id ||
                                                            customer.id ||
                                                            customer.email
                                                        }
                                                        className="flex items-center justify-between border-b border-[#f0ede9] py-3 last:border-b-0"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {image ? (
                                                                <img
                                                                    src={
                                                                        image
                                                                    }
                                                                    alt=""
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1efeb] text-[9px] font-medium">
                                                                    {name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-[10px] font-medium">
                                                                    {
                                                                        name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-[8px] text-gray-400">
                                                                    {customer?.email ||
                                                                        "—"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className="text-[8px] text-gray-400">
                                                            {formatDate(
                                                                customer?.createdAt
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )
                                ) : (
                                    <div className="py-10 text-center text-xs text-gray-400">
                                        No customers found.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-md border border-[#e6e1db] bg-white p-5">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#aaa49d]">
                                        Feedback
                                    </p>

                                    <h2 className="mt-1 font-serif text-xl">
                                        Recent Reviews
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setModal({
                                            type: "reviews",
                                        })
                                    }
                                    className="text-[10px] font-medium hover:underline"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="mt-6 space-y-1">
                                {reviews.length ? (
                                    reviews
                                        .slice(0, 5)
                                        .map(
                                            (
                                                review
                                            ) => {
                                                const name =
                                                    review?.customerName ||
                                                    review?.userName ||
                                                    review?.name ||
                                                    "Customer";

                                                const rating =
                                                    Math.min(
                                                        Number(
                                                            review?.rating ||
                                                            0
                                                        ),
                                                        5
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            review._id ||
                                                            `${review.productId}-${review.createdAt}`
                                                        }
                                                        className="border-b border-[#f0ede9] py-3 last:border-b-0"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className="text-[10px] font-medium">
                                                                {
                                                                    name
                                                                }
                                                            </p>

                                                            <span className="text-[10px] tracking-[1px]">
                                                                {"★".repeat(
                                                                    rating
                                                                )}
                                                                <span className="text-gray-200">
                                                                    {"★".repeat(
                                                                        5 -
                                                                        rating
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-[9px] text-gray-500">
                                                            {review?.comment ||
                                                                review?.text ||
                                                                "No review text."}
                                                        </p>

                                                        <p className="mt-1 text-[8px] text-gray-400">
                                                            {review?.productName ||
                                                                review?.product?.name ||
                                                                "Product"}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )
                                ) : (
                                    <div className="py-10 text-center text-xs text-gray-400">
                                        No reviews found.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <section className="mt-5 grid gap-3 sm:grid-cols-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-[10px] font-medium text-white transition hover:bg-[#222]"
                        >
                            <Icon
                                name="products"
                                size={14}
                            />

                            Manage Products
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "orders",
                                })
                            }
                            className="flex items-center justify-center gap-2 rounded-md border border-[#e4dfd9] bg-white px-4 py-3 text-[10px] font-medium transition hover:bg-[#f5f3f0]"
                        >
                            <Icon
                                name="orders"
                                size={14}
                            />

                            View Orders
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 rounded-md border border-[#e4dfd9] bg-white px-4 py-3 text-[10px] font-medium text-gray-600 transition hover:text-black"
                        >
                            Logout
                        </button>
                    </section>
                </main>
            </div>

            <AdminModal
                modal={modal}
                setModal={setModal}
                customers={customers}
                reviews={reviews}
                products={products}
                displayOrders={displayOrders}
                navigate={navigate}
            />

            <Footer />
        </>
    );
}


function AdminModal({
    modal,
    setModal,
    customers,
    reviews,
    products,
    displayOrders,
    navigate,
}) {
    if (!modal) return null;

    const close = () => setModal(null);

  
    if (modal.type === "order") {
        const order = modal.order;

        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[540px] rounded-md bg-white p-6 shadow-2xl sm:p-8"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="text-center">
                        <p className="font-serif text-[11px] tracking-[0.2em] text-[#99958e]">
                            FASCO
                        </p>

                        <h2 className="mt-2 font-serif text-2xl">
                            Order Details
                        </h2>
                    </div>

                    <div className="mt-7 divide-y divide-[#eeeae5] border border-[#eeeae5]">
                        {[
                            [
                                "Order ID",
                                order?.id,
                            ],
                            [
                                "Customer",
                                order?.customer,
                            ],
                            [
                                "Product",
                                order?.product,
                            ],
                            [
                                "Date",
                                order?.date,
                            ],
                            [
                                "Amount",
                                formatMoney(
                                    order?.amount
                                ),
                            ],
                            [
                                "Payment",
                                order?.payment,
                            ],
                            [
                                "Status",
                                order?.status,
                            ],
                        ].map(
                            ([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between gap-5 px-4 py-3 text-xs"
                                >
                                    <span className="text-gray-500">
                                        {label}
                                    </span>

                                    <span className="text-right font-medium">
                                        {value}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="mt-6 h-11 w-full rounded-md bg-black text-[10px] font-medium text-white"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        );
    }


    if (modal.type === "product") {
        const product = modal.product;

        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[420px] rounded-md bg-white p-7 shadow-2xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <p className="text-center font-serif text-[11px] tracking-[0.2em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        Product
                    </h2>

                    <p className="mt-3 text-center text-sm">
                        {product?.name ||
                            product?.title ||
                            "Product"}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                close();

                                navigate(
                                    `/admin/products/edit/${product?._id ||
                                    product?.id
                                    }`
                                );
                            }}
                            className="h-10 border border-gray-200 text-[10px] font-medium"
                        >
                            EDIT
                        </button>

                        <button
                            type="button"
                            onClick={close}
                            className="h-10 bg-black text-[10px] font-medium text-white"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    let title = "";
    let description = "";
    let rows = [];

    if (modal.type === "customers") {
        title = "Customers";

        description =
            "Real customers loaded from the database.";

        rows = customers.map(
            (customer) => [
                customer?.name ||
                customer?.username ||
                "Customer",

                customer?.email ||
                "—",

                formatDate(
                    customer?.createdAt
                ),
            ]
        );
    }

    if (modal.type === "reviews") {
        title = "All Reviews";

        description =
            "Real customer reviews loaded from the database.";

        rows = reviews.map(
            (review) => [
                review?.customerName ||
                review?.userName ||
                review?.name ||
                "Customer",

                review?.productName ||
                review?.product?.name ||
                "Product",

                review?.rating
                    ? `${Number(
                        review.rating
                    )}/5`
                    : "—",
            ]
        );
    }

    if (modal.type === "products") {
        title = "All Products";

        description =
            "Real products loaded from the database.";

        rows = products.map(
            (product) => [
                product?.name ||
                product?.title ||
                "Product",

                product?.category ||
                product?.categoryName ||
                "—",

                formatMoney(
                    product?.price
                ),

                String(
                    getProductStock(
                        product
                    )
                ),
            ]
        );
    }

    if (modal.type === "orders") {
        title = "All Orders";

        description =
            "Real orders loaded from the database.";

        rows = displayOrders.map(
            (order) => [
                order?.id,
                order?.customer,
                formatMoney(
                    order?.amount
                ),
                order?.status,
            ]
        );
    }

    if (
        [
            "customers",
            "reviews",
            "products",
            "orders",
        ].includes(modal.type)
    ) {
        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[900px] rounded-md bg-white p-6 shadow-2xl sm:p-8"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="text-center">
                        <p className="font-serif text-[11px] tracking-[0.2em] text-[#99958e]">
                            FASCO
                        </p>

                        <h2 className="mt-2 font-serif text-2xl">
                            {title}
                        </h2>

                        <p className="mt-2 text-xs text-gray-500">
                            {description}
                        </p>
                    </div>

                    <div className="mt-7 max-h-[60vh] overflow-auto border border-[#eeeae5]">
                        {rows.length ? (
                            rows.map(
                                (
                                    row,
                                    index
                                ) => (
                                    <div
                                        key={`${index}-${row.join(
                                            "-"
                                        )}`}
                                        className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-[#eeeae5] px-4 py-4 text-xs last:border-b-0"
                                    >
                                        {row.map(
                                            (
                                                value,
                                                valueIndex
                                            ) => (
                                                <span
                                                    key={
                                                        valueIndex
                                                    }
                                                    className={
                                                        valueIndex ===
                                                            row.length -
                                                            1
                                                            ? "text-right text-gray-500"
                                                            : ""
                                                    }
                                                >
                                                    {
                                                        value
                                                    }
                                                </span>
                                            )
                                        )}
                                    </div>
                                )
                            )
                        ) : (
                            <div className="p-10 text-center text-xs text-gray-400">
                                No real data found.
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="mt-6 h-11 w-full rounded-md bg-black text-[10px] font-medium text-white"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default AdminDashboard;