import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminProfile } from "../services/adminAuthApi";

function AdminDashboard() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

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

            {/* =====================================================
                DASHBOARD CONTENT ONLY
                Navbar + Footer are coming from App.jsx
            ====================================================== */}

            <div className="mx-auto max-w-1280px px-5 py-10 sm:px-8 lg:px-10">

                {/* =====================================================
                    TOP HEADER
                ====================================================== */}

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

                            <span className="text-gray-400">
                                ▣
                            </span>
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

                {/* =====================================================
                    STAT CARDS
                ====================================================== */}

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
                                    $124,500
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
                                    3,492
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 12.5% from last month
                                </p>
                            </div>

                            <span className="text-xl">
                                ♧
                            </span>

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
                                    12,840
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 21.1% from last month
                                </p>
                            </div>

                            <span className="text-xl">
                                ♙
                            </span>

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
                                    268
                                </p>

                                <p className="mt-2 text-[11px] text-green-600">
                                    ↑ 8.7% from last month
                                </p>
                            </div>

                            <span className="text-xl">
                                ◇
                            </span>

                        </div>
                    </button>

                </div>

                {/* =====================================================
                    SECONDARY STATS
                ====================================================== */}

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
                            120
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                            —
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
                            18
                        </p>

                        <p className="mt-2 text-[11px] text-red-500">
                            ↓ 2.4% from last month
                        </p>
                    </button>

                </div>

                {/* =====================================================
                    REVENUE OVERVIEW
                ====================================================== */}

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
                                className="transition hover:text-black"
                            >
                                This Week
                            </button>

                            <button
                                type="button"
                                className="border-b border-black pb-1 font-medium text-black"
                            >
                                This Month
                            </button>

                            <button
                                type="button"
                                className="transition hover:text-black"
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
                                    $124,500
                                </p>

                                <p className="text-[10px] text-green-600">
                                    ↑ 12.5% from last month
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
                                    $124,500
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
                                <span>Jul 24</span>
                                <span>Jul 31</span>
                                <span>Aug 07</span>
                                <span>Aug 14</span>
                                <span>Aug 21</span>
                            </div>

                        </div>

                    </div>
                </section>

                {/* =====================================================
                    RECENT ORDERS
                ====================================================== */}

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
                            onClick={() => goTo("orders")}
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

                                {[
                                    ["#ORD-8924A", "Alexandra V.", "The Structured Tote", "Aug 23, 2026", "$320.00", "Paid", "Shipped"],
                                    ["#ORD-7712B", "Jonathan M.", "Linen Blazer", "Aug 22, 2026", "$189.00", "Paid", "Processing"],
                                    ["#ORD-5632C", "Sophia L.", "Silk Shirt", "Aug 21, 2026", "$129.00", "Paid", "Delivered"],
                                    ["#ORD-4453D", "David K.", "Wool Coat", "Aug 20, 2026", "$349.00", "Unpaid", "Pending"],
                                    ["#ORD-3321E", "Emma R.", "Wide Leg Pants", "Aug 19, 2026", "$145.00", "Paid", "Cancelled"],
                                ].map((order) => (
                                    <tr
                                        key={order[0]}
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
                                            <span className={`rounded px-2 py-1 text-[10px] ${
                                                order[5] === "Paid"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-600"
                                            }`}>
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
                                                onClick={() => alert(`Viewing ${order[0]}`)}
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

                {/* =====================================================
                    PRODUCTS
                ====================================================== */}

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
                                onClick={() =>
                                    alert("Add New Product")
                                }
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

                                {[
                                    ["The Structured Tote", "Bags", "$320.00", "45", "In Stock", "Aug 10, 2026"],
                                    ["Linen Blazer", "Outerwear", "$189.00", "32", "In Stock", "Aug 09, 2026"],
                                    ["Silk Shirt", "Tops", "$129.00", "0", "Out of Stock", "Aug 08, 2026"],
                                    ["Wool Coat", "Outerwear", "$349.00", "8", "Low Stock", "Aug 07, 2026"],
                                    ["Wide Leg Pants", "Bottoms", "$145.00", "12", "Low Stock", "Aug 06, 2026"],
                                ].map((product) => (
                                    <tr
                                        key={product[0]}
                                        className="transition hover:bg-[#faf9f7]"
                                    >

                                        <td className="px-4 py-4 font-medium">
                                            {product[0]}
                                        </td>

                                        <td className="px-4 py-4 text-gray-500">
                                            {product[1]}
                                        </td>

                                        <td className="px-4 py-4">
                                            {product[2]}
                                        </td>

                                        <td className="px-4 py-4">
                                            {product[3]}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded px-2 py-1 text-[10px] ${
                                                    product[4] === "In Stock"
                                                        ? "bg-green-50 text-green-700"
                                                        : product[4] === "Low Stock"
                                                        ? "bg-yellow-50 text-yellow-700"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                {product[4]}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-gray-500">
                                            {product[5]}
                                        </td>

                                        <td className="px-4 py-4">

                                            <div className="flex gap-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        alert(`Edit ${product[0]}`)
                                                    }
                                                    className="hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        alert(`Delete ${product[0]}`)
                                                    }
                                                    className="text-gray-500 hover:text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                </section>

                {/* =====================================================
                    CUSTOMERS
                ====================================================== */}

                <section
                    id="customers"
                    className="mt-5 rounded-lg border border-gray-200 bg-white p-6 scroll-mt-24"
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
                            onClick={() => alert("View All Customers")}
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
                                12,840
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

                {/* =====================================================
                    REVIEWS
                ====================================================== */}

                <section
                    id="reviews"
                    className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white scroll-mt-24"
                >

                    <div className="flex items-center justify-between border-b border-gray-100 p-5">

                        <h2 className="font-serif text-xl">
                            Top Reviews
                        </h2>

                        <button
                            type="button"
                            onClick={() => goTo("reviews")}
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

                {/* =====================================================
                    ADMIN ACCOUNT
                ====================================================== */}

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
        </div>
    );
}

export default AdminDashboard;