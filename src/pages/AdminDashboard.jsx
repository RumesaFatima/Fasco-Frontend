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

    const [revenuePeriod, setRevenuePeriod] = useState("month");
    const [modal, setModal] = useState(null);

    const defaultProducts = [
        {
            id: 1,
            name: "The Structured Tote",
            category: "Bags",
            price: 320,
            stock: 45,
            date: "Aug 10, 2026",
        },
        {
            id: 2,
            name: "Linen Blazer",
            category: "Outerwear",
            price: 189,
            stock: 32,
            date: "Aug 09, 2026",
        },
        {
            id: 3,
            name: "Silk Shirt",
            category: "Tops",
            price: 129,
            stock: 0,
            date: "Aug 08, 2026",
        },
        {
            id: 4,
            name: "Wool Coat",
            category: "Outerwear",
            price: 349,
            stock: 8,
            date: "Aug 07, 2026",
        },
        {
            id: 5,
            name: "Wide Leg Pants",
            category: "Bottoms",
            price: 145,
            stock: 12,
            date: "Aug 06, 2026",
        },
    ];

    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem("fascoAdminProducts");

            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error("Products load error:", error);
        }

        return defaultProducts;
    });

    const [productForm, setProductForm] = useState({
        name: "",
        category: "Bags",
        price: "",
        stock: "",
    });

    useEffect(() => {
        localStorage.setItem(
            "fascoAdminProducts",
            JSON.stringify(products)
        );
    }, [products]);

    useEffect(() => {
        const loadAdmin = async () => {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const data = await getAdminProfile();

                if (!data?.success) {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("admin");
                    navigate("/login");
                    return;
                }

                setAdmin(data.admin);

                const dashboardData = await getDashboardStats();

                if (dashboardData?.success) {
                    setStats({
                        totalUsers: dashboardData.stats?.totalUsers || 0,
                        totalProducts:
                            dashboardData.stats?.totalProducts || 0,
                        totalOrders:
                            dashboardData.stats?.totalOrders || 0,
                        totalSales:
                            dashboardData.stats?.totalSales || 0,
                        pendingOrders:
                            dashboardData.stats?.pendingOrders || 0,
                        lowStockProducts:
                            dashboardData.stats?.lowStockProducts || 0,
                        outOfStockProducts:
                            dashboardData.stats?.outOfStockProducts || 0,
                        totalReviews:
                            dashboardData.stats?.totalReviews || 0,
                    });

                    setOrders(dashboardData.orders || []);
                    setCustomers(dashboardData.customers || []);
                    setReviews(dashboardData.reviews || []);
                }
            } catch (error) {
                console.error("Admin profile error:", error);

                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/login");
    };

    const goTo = (section) => {
        const element = document.getElementById(section);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const getProductStatus = (stock) => {
        if (stock <= 0) return "Out of Stock";
        if (stock <= 10) return "Low Stock";
        return "In Stock";
    };

    const openAddProduct = () => {
        setProductForm({
            name: "",
            category: "Bags",
            price: "",
            stock: "",
        });

        setModal({
            type: "product",
            mode: "add",
        });
    };

    const openEditProduct = (product) => {
        setProductForm({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
        });

        setModal({
            type: "product",
            mode: "edit",
            product,
        });
    };

    const saveProduct = (event) => {
        event.preventDefault();

        const name = productForm.name.trim();
        const price = Number(productForm.price);
        const stock = Number(productForm.stock);

        if (!name) return;

        if (Number.isNaN(price) || Number.isNaN(stock)) return;

        if (productForm.id) {
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === productForm.id
                        ? {
                            ...product,
                            name,
                            category: productForm.category,
                            price,
                            stock,
                        }
                        : product
                )
            );

            setModal({
                type: "success",
                title: "Product Updated",
                message: `${name} has been updated successfully.`,
            });

            return;
        }

        const newProduct = {
            id: Date.now(),
            name,
            category: productForm.category,
            price,
            stock,
            date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };

        setProducts((currentProducts) => [
            newProduct,
            ...currentProducts,
        ]);

        setModal({
            type: "success",
            title: "Product Added",
            message: `${name} has been added successfully.`,
        });
    };

    const openDeleteProduct = (product) => {
        setModal({
            type: "delete",
            product,
        });
    };

    const deleteProduct = () => {
        const deletedName = modal?.product?.name;

        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) => product.id !== modal.product.id
            )
        );

        setModal({
            type: "success",
            title: "Product Deleted",
            message: `${deletedName} has been deleted successfully.`,
        });
    };

    const fallbackOrders = [
        [
            "#ORD-8924A",
            "Alexandra V.",
            "The Structured Tote",
            "Aug 23, 2026",
            "$320.00",
            "Paid",
            "Shipped",
        ],
        [
            "#ORD-7712B",
            "Jonathan M.",
            "Linen Blazer",
            "Aug 22, 2026",
            "$189.00",
            "Paid",
            "Processing",
        ],
        [
            "#ORD-5632C",
            "Sophia L.",
            "Silk Shirt",
            "Aug 21, 2026",
            "$129.00",
            "Paid",
            "Delivered",
        ],
        [
            "#ORD-4453D",
            "David K.",
            "Wool Coat",
            "Aug 20, 2026",
            "$349.00",
            "Unpaid",
            "Pending",
        ],
        [
            "#ORD-3321E",
            "Emma R.",
            "Wide Leg Pants",
            "Aug 19, 2026",
            "$145.00",
            "Paid",
            "Cancelled",
        ],
    ];

    const displayOrders =
        orders.length > 0
            ? orders.map((order) => {
                if (Array.isArray(order)) return order;

                return [
                    order.id || order._id || "#ORDER",
                    order.customerName ||
                    order.userName ||
                    order.user ||
                    "Customer",
                    order.productName ||
                    order.lines?.[0]?.name ||
                    "Product",
                    order.createdAt
                        ? new Date(
                            order.createdAt
                        ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })
                        : "—",
                    `$${Number(order.total || 0).toFixed(2)}`,
                    order.paymentStatus || "Paid",
                    order.status || "Processing",
                ];
            })
            : fallbackOrders;

    const viewOrder = (order) => {
        setModal({
            type: "order",
            order,
        });
    };

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
            <div className="mx-auto max-w-1280px px-5 py-10 sm:px-8 lg:px-10">
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                            Overview
                        </p>

                        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
                            Good Morning, Admin.
                        </h1>

                        <p className="mt-3 text-sm text-gray-500">
                            Here's what's happening with your FASCO store today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                            <span className="text-sm text-gray-600">
                                August 23, 2026
                            </span>

                            <span className="text-gray-400">▣</span>
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
                        className="group rounded-lg border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Total Sales
                                </p>

                                <p className="mt-3 font-serif text-2xl">
                                    $
                                    {Number(
                                        stats.totalSales || 0
                                    ).toLocaleString()}
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 12.5% from last month
                                </p>
                            </div>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white">
                                $
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="group rounded-lg border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Total Orders
                                </p>

                                <p className="mt-3 font-serif text-2xl">
                                    {stats.totalOrders}
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 12.5% from last month
                                </p>
                            </div>

                            <span className="text-xl">♧</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("customers")}
                        className="group rounded-lg border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Total Customers
                                </p>

                                <p className="mt-3 font-serif text-2xl">
                                    {stats.totalUsers}
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 21.1% from last month
                                </p>
                            </div>

                            <span className="text-xl">♙</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("products")}
                        className="group rounded-lg border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Total Products
                                </p>

                                <p className="mt-3 font-serif text-2xl">
                                    {products.length}
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 8.7% from last month
                                </p>
                            </div>

                            <span className="text-xl">◇</span>
                        </div>
                    </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                        <p className="mt-2 text-[11px] text-gray-400">—</p>
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
                            {products.filter(
                                (product) =>
                                    product.stock > 0 &&
                                    product.stock <= 10
                            ).length}
                        </p>

                        <p className="mt-2 text-[11px] text-red-500">
                            ↓ 2.4% from last month
                        </p>
                    </button>
                </div>

                <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-serif text-xl">
                                Revenue Overview
                            </h2>
                        </div>

                        <div className="flex gap-6 text-xs text-gray-500">
                            <button
                                type="button"
                                onClick={() => setRevenuePeriod("week")}
                                className={
                                    revenuePeriod === "week"
                                        ? "border-b border-black pb-1 font-medium text-black"
                                        : "transition hover:text-black"
                                }
                            >
                                This Week
                            </button>

                            <button
                                type="button"
                                onClick={() => setRevenuePeriod("month")}
                                className={
                                    revenuePeriod === "month"
                                        ? "border-b border-black pb-1 font-medium text-black"
                                        : "transition hover:text-black"
                                }
                            >
                                This Month
                            </button>

                            <button
                                type="button"
                                onClick={() => setRevenuePeriod("year")}
                                className={
                                    revenuePeriod === "year"
                                        ? "border-b border-black pb-1 font-medium text-black"
                                        : "transition hover:text-black"
                                }
                            >
                                This Year
                            </button>
                        </div>
                    </div>

                    <div className="mt-7 grid gap-8 lg:grid-cols-[170px_1fr]">
                        <div className="space-y-5">
                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Total Revenue
                                </p>

                                <p className="mt-1 font-serif text-lg">
                                    $
                                    {revenuePeriod === "week"
                                        ? "28,450"
                                        : revenuePeriod === "year"
                                            ? "248,450"
                                            : Number(
                                                stats.totalSales || 0
                                            ).toLocaleString()}
                                </p>

                                <p className="text-[10px] text-green-600">
                                    ↑ 12.5% from previous period
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Today's Sales
                                </p>

                                <p className="mt-1 font-serif text-lg">
                                    $4,350
                                </p>

                                <p className="text-[10px] text-green-600">
                                    ↑ 8.1% from yesterday
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Weekly Sales
                                </p>

                                <p className="mt-1 font-serif text-lg">
                                    $28,450
                                </p>

                                <p className="text-[10px] text-green-600">
                                    ↑ 15.3% from last week
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Monthly Sales
                                </p>

                                <p className="mt-1 font-serif text-lg">
                                    $
                                    {Number(
                                        stats.totalSales || 0
                                    ).toLocaleString()}
                                </p>

                                <p className="text-[10px] text-green-600">
                                    ↑ 12.5% from last month
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[250px] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col justify-between">
                                <div className="border-t border-gray-100" />
                                <div className="border-t border-gray-100" />
                                <div className="border-t border-gray-100" />
                                <div className="border-t border-gray-100" />
                                <div className="border-t border-gray-100" />
                            </div>

                            <svg
                                viewBox="0 0 800 250"
                                className="absolute inset-0 h-full w-full"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 205
                                    C30 202 38 185 65 185
                                    C92 184 96 166 125 165
                                    C150 164 163 175 190 163
                                    C220 151 225 125 250 128
                                    C275 131 278 156 305 151
                                    C332 145 340 126 365 132
                                    C390 138 397 113 425 101
                                    C455 89 465 109 490 93
                                    C520 75 530 115 552 130
                                    C576 147 588 115 610 98
                                    C635 78 650 111 675 91
                                    C705 68 710 88 735 76
                                    C760 64 777 72 800 55"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-gray-900"
                                />
                            </svg>

                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400">
                                {revenuePeriod === "week" ? (
                                    <>
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </>
                                ) : revenuePeriod === "year" ? (
                                    <>
                                        <span>Jan</span>
                                        <span>Mar</span>
                                        <span>May</span>
                                        <span>Jul</span>
                                        <span>Sep</span>
                                        <span>Nov</span>
                                        <span>Dec</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Jul 24</span>
                                        <span>Jul 31</span>
                                        <span>Aug 07</span>
                                        <span>Aug 14</span>
                                        <span>Aug 21</span>
                                    </>
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
                                setModal({
                                    type: "orders",
                                })
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
                                {displayOrders
                                    .slice(0, 5)
                                    .map((order, index) => (
                                        <tr
                                            key={`${order[0]}-${index}`}
                                            className="transition hover:bg-[#faf9f7]"
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                {order[0]}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order[1]}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order[2]}
                                            </td>

                                            <td className="px-4 py-4 text-gray-500">
                                                {order[3]}
                                            </td>

                                            <td className="px-4 py-4">
                                                {order[4]}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded px-2 py-1 text-[10px] ${order[5] === "Paid"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {order[5]}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px]">
                                                    {order[6]}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        viewOrder(order)
                                                    }
                                                    className="text-gray-500 transition hover:text-black hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => goTo("products")}
                                className="text-xs font-medium hover:underline"
                            >
                                View All Products
                            </button>

                            <button
                                type="button"
                                onClick={openAddProduct}
                                className="rounded bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                            >
                                + Add New Product
                            </button>
                        </div>
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
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => {
                                    const status = getProductStatus(
                                        Number(product.stock)
                                    );

                                    return (
                                        <tr
                                            key={product.id}
                                            className="transition hover:bg-[#faf9f7]"
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                {product.name}
                                            </td>

                                            <td className="px-4 py-4 text-gray-500">
                                                {product.category}
                                            </td>

                                            <td className="px-4 py-4">
                                                $
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </td>

                                            <td className="px-4 py-4">
                                                {product.stock}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded px-2 py-1 text-[10px] ${status === "In Stock"
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
                                                {product.date}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditProduct(
                                                                product
                                                            )
                                                        }
                                                        className="hover:underline"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteProduct(
                                                                product
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                Customer overview and account activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "customers",
                                })
                            }
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
                                New This Month
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                                842
                            </p>
                        </div>

                        <div className="border border-gray-100 p-5">
                            <p className="text-xs text-gray-500">
                                Active Customers
                            </p>

                            <p className="mt-2 font-serif text-2xl">
                                9,421
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
                            Top Reviews
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setModal({
                                    type: "reviews",
                                })
                            }
                            className="text-xs font-medium hover:underline"
                        >
                            View All Reviews
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {[
                            [
                                "Alexandra V.",
                                "The Structured Tote",
                                "★★★★★",
                                "Absolutely love the quality and design. Worth every penny!",
                                "Aug 21, 2026",
                            ],
                            [
                                "Jonathan M.",
                                "Linen Blazer",
                                "★★★★☆",
                                "Great fit and fabric. Very classy.",
                                "Aug 20, 2026",
                            ],
                            [
                                "Sophia L.",
                                "Silk Shirt",
                                "★★★★★",
                                "So soft and elegant. My new favorite.",
                                "Aug 19, 2026",
                            ],
                        ].map((review) => (
                            <div
                                key={review[0]}
                                className="grid gap-3 p-5 transition hover:bg-[#faf9f7] md:grid-cols-[150px_180px_110px_1fr_110px]"
                            >
                                <div>
                                    <p className="text-xs font-medium">
                                        {review[0]}
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        @customer
                                    </p>
                                </div>

                                <p className="text-xs">
                                    {review[1]}
                                </p>

                                <p className="text-sm tracking-wide">
                                    {review[2]}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {review[3]}
                                </p>

                                <p className="text-[10px] text-gray-400">
                                    {review[4]}
                                </p>
                            </div>
                        ))}
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
                productForm={productForm}
                setProductForm={setProductForm}
                saveProduct={saveProduct}
                deleteProduct={deleteProduct}
            />
        </div>
    );
}

function AdminModal({
    modal,
    setModal,
    productForm,
    setProductForm,
    saveProduct,
    deleteProduct,
}) {
    if (!modal) return null;

    const close = () => setModal(null);

    const inputClass =
        "mt-1 w-full border border-[#dedbd6] bg-white px-3 py-2.5 text-xs outline-none focus:border-black";

    if (modal.type === "delete") {
        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[520px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-black text-sm">
                        ▥
                    </div>

                    <p className="mt-4 text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        Delete Product?
                    </h2>

                    <p className="mx-auto mt-2 max-w-[330px] text-center text-xs leading-5 text-[#77736d]">
                        Are you sure you want to delete this product?
                        This action cannot be undone.
                    </p>

                    <p className="mt-2 text-center text-xs font-medium">
                        {modal.product?.name}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={close}
                            className="h-10 border border-[#bdb9b2] bg-white text-[10px] font-medium"
                        >
                            CANCEL
                        </button>

                        <button
                            type="button"
                            onClick={deleteProduct}
                            className="h-10 bg-black text-[10px] font-medium text-white"
                        >
                            DELETE
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (modal.type === "success") {
        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[420px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-black text-sm">
                        ✓
                    </div>

                    <p className="mt-4 text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        {modal.title}
                    </h2>

                    <p className="mx-auto mt-2 max-w-[300px] text-center text-xs leading-5 text-[#77736d]">
                        {modal.message}
                    </p>

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

    if (modal.type === "product") {
        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[520px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <p className="text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        {modal.mode === "edit"
                            ? "Edit Product"
                            : "Add New Product"}
                    </h2>

                    <form
                        onSubmit={saveProduct}
                        className="mt-6 space-y-3"
                    >
                        <label className="block text-xs">
                            Product Name

                            <input
                                required
                                value={productForm.name}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        name: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="Product name"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="block text-xs">
                                Category

                                <select
                                    value={productForm.category}
                                    onChange={(event) =>
                                        setProductForm({
                                            ...productForm,
                                            category:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                >
                                    <option>Bags</option>
                                    <option>Outerwear</option>
                                    <option>Tops</option>
                                    <option>Bottoms</option>
                                    <option>Dresses</option>
                                    <option>Accessories</option>
                                </select>
                            </label>

                            <label className="block text-xs">
                                Price

                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={productForm.price}
                                    onChange={(event) =>
                                        setProductForm({
                                            ...productForm,
                                            price: event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </label>
                        </div>

                        <label className="block text-xs">
                            Stock

                            <input
                                required
                                type="number"
                                min="0"
                                step="1"
                                value={productForm.stock}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        stock: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="0"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-3 pt-3">
                            <button
                                type="button"
                                onClick={close}
                                className="h-10 border border-[#bdb9b2] text-[10px] font-medium"
                            >
                                CANCEL
                            </button>

                            <button
                                type="submit"
                                className="h-10 bg-black text-[10px] font-medium text-white"
                            >
                                {modal.mode === "edit"
                                    ? "SAVE CHANGES"
                                    : "ADD PRODUCT"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (modal.type === "order") {
        const order = modal.order;

        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[520px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
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
                            <span>{order?.[0]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Customer</span>
                            <span>{order?.[1]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Product</span>
                            <span>{order?.[2]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Date</span>
                            <span>{order?.[3]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Amount</span>
                            <span>{order?.[4]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Payment</span>
                            <span>{order?.[5]}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Status</span>
                            <span>{order?.[6]}</span>
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

    const simpleLists = {
        customers: {
            title: "Customers",
            description:
                "Customer overview and account activity.",
            rows:
                customers.length > 0
                    ? customers.map((customer) => [
                        customer.name || "Customer",
                        customer.email || "—",
                        customer.status || "Active",
                    ])
                    : [
                        [
                            "Alexandra V.",
                            "alexandra@example.com",
                            "Active",
                        ],
                        [
                            "Jonathan M.",
                            "jonathan@example.com",
                            "Active",
                        ],
                        [
                            "Sophia L.",
                            "sophia@example.com",
                            "Active",
                        ],
                        [
                            "David K.",
                            "david@example.com",
                            "Pending",
                        ],
                    ],
        },

        reviews: {
            title: "All Reviews",
            description:
                "Recent customer reviews for FASCO products.",
            rows:
                reviews.length > 0
                    ? reviews.map((review) => [
                        review.userName ||
                        review.customerName ||
                        "Customer",
                        review.productName ||
                        "Product",
                        review.rating
                            ? "★".repeat(
                                Math.min(
                                    Number(review.rating),
                                    5
                                )
                            )
                            : "★★★★★",
                    ])
                    : [
                        [
                            "Alexandra V.",
                            "The Structured Tote",
                            "★★★★★",
                        ],
                        [
                            "Jonathan M.",
                            "Linen Blazer",
                            "★★★★☆",
                        ],
                        [
                            "Sophia L.",
                            "Silk Shirt",
                            "★★★★★",
                        ],
                    ],
        },

        orders: {
            title: "All Orders",
            description: "Recent FASCO orders.",
            rows: displayOrders.map((order) => [
                order[0],
                order[1],
                order[4],
            ]),
        },
    };

    if (simpleLists[modal.type]) {
        const data = simpleLists[modal.type];

        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
                onMouseDown={close}
            >
                <div
                    className="w-full max-w-[720px] rounded-md border border-[#e5e2dd] bg-white p-7 shadow-xl"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <p className="text-center font-serif text-[11px] tracking-[0.18em] text-[#99958e]">
                        FASCO
                    </p>

                    <h2 className="mt-3 text-center font-serif text-xl">
                        {data.title}
                    </h2>

                    <p className="mt-2 text-center text-xs text-[#77736d]">
                        {data.description}
                    </p>

                    <div className="mt-6 overflow-hidden border border-[#eeeae5]">
                        {data.rows.map((row, index) => (
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
                        ))}
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