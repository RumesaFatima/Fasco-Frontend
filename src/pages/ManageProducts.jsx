import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const emptyForm = {
    id: "",
    name: "",
    category: "",
    brand: "FASCO",
    price: "",
    oldPrice: "",
    rating: "4",
    reviews: "0",
    stock: "10",
    image: "",
    gallery: "",
    description: "",
    tags: "",
    sizes: "",
    colors: "",
};

const getProductId = (product) =>
    product?._id || product?.id;

const getProductName = (product) =>
    product?.name || product?.title || "Product";

const getProductImage = (product) =>
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.images?.[0] ||
    product?.gallery?.[0] ||
    "";

const getStock = (product) =>
    Number(
        product?.stock ??
        product?.quantity ??
        product?.inventory ??
        0
    );

const getStatus = (product) => {
    const stock = getStock(product);

    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";

    return "In Stock";
};

const formatDate = (date) => {
    if (!date) return "—";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "—";

    return value.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const formToProduct = (form) => ({
    id: form.id.trim(),
    name: form.name.trim(),
    category: form.category.trim(),
    brand: form.brand.trim() || "FASCO",
    price: Number(form.price),
    ...(form.oldPrice !== ""
        ? { oldPrice: Number(form.oldPrice) }
        : {}),
    rating: Number(form.rating) || 0,
    reviews: Number(form.reviews) || 0,
    stock: Number(form.stock) || 0,
    image: form.image.trim(),
    gallery: form.gallery
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    description: form.description.trim(),
    tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    sizes: form.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    colors: form.colors
        .split("\n")
        .map((item) => {
            const [name, hex] = item.split("|");

            return {
                name: name?.trim() || "",
                hex: hex?.trim() || "",
            };
        })
        .filter((item) => item.name),
});

const productToForm = (product) => ({
    id: product?.id || "",
    name: product?.name || "",
    category: product?.category || "",
    brand: product?.brand || "FASCO",
    price: product?.price ?? "",
    oldPrice: product?.oldPrice ?? "",
    rating: product?.rating ?? "4",
    reviews: product?.reviews ?? "0",
    stock: product?.stock ?? "10",
    image: product?.image || "",
    gallery: Array.isArray(product?.gallery)
        ? product.gallery.join("\n")
        : "",
    description: product?.description || "",
    tags: Array.isArray(product?.tags)
        ? product.tags.join(", ")
        : "",
    sizes: Array.isArray(product?.sizes)
        ? product.sizes.join(", ")
        : "",
    colors: Array.isArray(product?.colors)
        ? product.colors
            .map(
                (color) =>
                    `${color?.name || ""}|${color?.hex || ""}`
            )
            .join("\n")
        : "",
});

const adminRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        throw new Error("Admin authorization required");
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
};

function ManageProducts() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deletingId, setDeletingId] = useState(null);
    const [showDelete, setShowDelete] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminRequest(
                "/api/admin/products"
            );

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.products)
                    ? data.products
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];

            setProducts(list);
        } catch (err) {
            if (
                err?.message === "Admin authorization required" ||
                err?.message === "Unauthorized" ||
                err?.message === "Invalid or expired admin token"
            ) {
                localStorage.removeItem("adminToken");
                navigate("/login");
                return;
            }

            setError(
                err?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/login");
            return;
        }

        loadProducts();
    }, [navigate]);

    const categories = useMemo(() => {
        const values = products
            .map((product) => product?.category)
            .filter(Boolean);

        return [
            "All",
            ...Array.from(new Set(values)),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return products.filter((product) => {
            const name =
                getProductName(product).toLowerCase();

            const productCategory =
                product?.category || "";

            const productStatus =
                getStatus(product);

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                String(productCategory)
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === "All" ||
                productCategory === category;

            const matchesStatus =
                status === "All" ||
                productStatus === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [
        products,
        search,
        category,
        status,
    ]);

    const openAddForm = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setForm(productToForm(product));
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingProduct(null);
        setForm(emptyForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = formToProduct(form);

            if (
                !payload.id ||
                !payload.name ||
                !payload.category ||
                Number.isNaN(payload.price)
            ) {
                throw new Error(
                    "ID, name, category and price are required."
                );
            }

            if (editingProduct) {
                const productId =
                    getProductId(editingProduct);

                const response = await adminRequest(
                    `/api/admin/products/${productId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    }
                );

                const updatedProduct =
                    response?.product ||
                    response?.data ||
                    response;

                setProducts((current) =>
                    current.map((product) =>
                        getProductId(product) === productId
                            ? updatedProduct
                            : product
                    )
                );

                setSuccess(
                    "Product updated successfully."
                );
            } else {
                const response = await adminRequest(
                    "/api/admin/products",
                    {
                        method: "POST",
                        body: JSON.stringify(payload),
                    }
                );

                const newProduct =
                    response?.product ||
                    response?.data ||
                    response;

                setProducts((current) => [
                    newProduct,
                    ...current,
                ]);

                setSuccess(
                    "Product created successfully."
                );
            }

            setTimeout(() => {
                setShowForm(false);
                setEditingProduct(null);
                setForm(emptyForm);
                setSuccess("");
            }, 700);
        } catch (err) {
            setError(
                err?.message ||
                "Failed to save product."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!showDelete) return;

        const productId =
            getProductId(showDelete);

        try {
            setDeletingId(productId);
            setError("");

            await adminRequest(
                `/api/admin/products/${productId}`,
                {
                    method: "DELETE",
                }
            );

            setProducts((current) =>
                current.filter(
                    (product) =>
                        getProductId(product) !== productId
                )
            );

            setShowDelete(null);
            setSuccess(
                "Product deleted successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 2500);
        } catch (err) {
            setError(
                err?.message ||
                "Failed to delete product."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f7] text-[#171717]">
            <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                            Admin
                        </p>

                        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
                            Manage Products
                        </h1>

                        <p className="mt-3 text-sm text-gray-500">
                            Manage your FASCO products.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="h-11 bg-black px-6 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#222]"
                    >
                        Add Product
                    </button>
                </div>

                <div className="mb-6 grid gap-3 md:grid-cols-[1fr_190px_180px]">
                    <div className="border border-[#e3dfda] bg-white">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search products..."
                            className="h-12 w-full bg-transparent px-4 text-sm outline-none"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                        className="h-12 border border-[#e3dfda] bg-white px-4 text-sm outline-none"
                    >
                        {categories.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                        className="h-12 border border-[#e3dfda] bg-white px-4 text-sm outline-none"
                    >
                        <option value="All">
                            All Status
                        </option>
                        <option value="In Stock">
                            In Stock
                        </option>
                        <option value="Low Stock">
                            Low Stock
                        </option>
                        <option value="Out of Stock">
                            Out of Stock
                        </option>
                    </select>
                </div>

                {error && !showForm && (
                    <div className="mb-5 border border-[#ead0cc] bg-[#fff5f3] px-4 py-3 text-sm text-[#b84d42]">
                        {error}
                    </div>
                )}

                {success && !showForm && (
                    <div className="mb-5 border border-[#d8e8d9] bg-[#f3faf3] px-4 py-3 text-sm text-[#3d7a48]">
                        {success}
                    </div>
                )}

                <div className="overflow-hidden border border-[#e3dfda] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#ebe7e2] bg-[#faf9f7] text-left">
                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Price
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Added
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#f0ede9]">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-16 text-center text-sm text-gray-500"
                                        >
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-16 text-center text-sm text-gray-500"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(
                                        (product) => {
                                            const id =
                                                getProductId(product);

                                            const image =
                                                getProductImage(product);

                                            const stock =
                                                getStock(product);

                                            const productStatus =
                                                getStatus(product);

                                            return (
                                                <tr
                                                    key={id}
                                                    className="transition hover:bg-[#faf9f7]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={getProductName(product)}
                                                                    className="h-12 w-10 rounded-sm bg-[#f5f3f0] object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-12 w-10 items-center justify-center rounded-sm bg-[#f5f3f0] text-[9px] text-gray-400">
                                                                    No Image
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {getProductName(product)}
                                                                </p>

                                                                {product?.brand && (
                                                                    <p className="mt-1 text-[10px] text-gray-400">
                                                                        {product.brand}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-500">
                                                        {product?.category || "—"}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm">
                                                        ${Number(
                                                            product?.price || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-500">
                                                        {stock}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium ${productStatus === "In Stock"
                                                                    ? "bg-[#edf7ee] text-[#3d7a48]"
                                                                    : productStatus === "Low Stock"
                                                                        ? "bg-[#fff5df] text-[#a86d05]"
                                                                        : "bg-[#fff0ee] text-[#c64e43]"
                                                                }`}
                                                        >
                                                            {productStatus}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-500">
                                                        {formatDate(product?.createdAt)}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditForm(product)
                                                                }
                                                                className="text-[11px] font-medium text-gray-500 transition hover:text-black"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowDelete(product)
                                                                }
                                                                className="text-[11px] font-medium text-[#c64e43] transition hover:text-black"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading &&
                        filteredProducts.length > 0 && (
                            <div className="flex items-center justify-between border-t border-[#ebe7e2] px-5 py-4">
                                <p className="text-[11px] text-gray-500">
                                    Showing {filteredProducts.length} of{" "}
                                    {products.length} products
                                </p>

                                <button
                                    type="button"
                                    onClick={loadProducts}
                                    className="text-[11px] font-medium uppercase tracking-0.1em text-gray-500 hover:text-black"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                </div>
            </main>

            {showForm && (
                <div className="fixed inset-0 z-100 overflow-y-auto bg-black/50 px-4 py-8">
                    <div className="mx-auto w-full max-w-4xl bg-white">
                        <div className="flex items-center justify-between border-b border-[#ebe7e2] px-6 py-5 sm:px-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                                    Admin
                                </p>

                                <h2 className="mt-1 font-serif text-3xl">
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="text-2xl font-light text-gray-400 hover:text-black"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 sm:p-8"
                        >
                            {error && (
                                <div className="mb-5 border border-[#ead0cc] bg-[#fff5f3] px-4 py-3 text-sm text-[#b84d42]">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-5 border border-[#d8e8d9] bg-[#f3faf3] px-4 py-3 text-sm text-[#3d7a48]">
                                    {success}
                                </div>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Product ID
                                    </label>

                                    <input
                                        name="id"
                                        value={form.id}
                                        onChange={handleChange}
                                        disabled={Boolean(editingProduct)}
                                        required
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black disabled:bg-[#f7f5f2]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Product Name
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Category
                                    </label>

                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                        placeholder="Women, Men, Kids..."
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Brand
                                    </label>

                                    <input
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Price
                                    </label>

                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Old Price
                                    </label>

                                    <input
                                        name="oldPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.oldPrice}
                                        onChange={handleChange}
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Stock
                                    </label>

                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={handleChange}
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Rating
                                    </label>

                                    <input
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={form.rating}
                                        onChange={handleChange}
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Reviews
                                    </label>

                                    <input
                                        name="reviews"
                                        type="number"
                                        min="0"
                                        value={form.reviews}
                                        onChange={handleChange}
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Main Image URL
                                    </label>

                                    <input
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Sizes
                                    </label>

                                    <input
                                        name="sizes"
                                        value={form.sizes}
                                        onChange={handleChange}
                                        placeholder="S, M, L, XL"
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Tags
                                    </label>

                                    <input
                                        name="tags"
                                        value={form.tags}
                                        onChange={handleChange}
                                        placeholder="dress, summer, new"
                                        className="h-12 w-full border border-[#e3dfda] px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Gallery URLs
                                    </label>

                                    <textarea
                                        name="gallery"
                                        value={form.gallery}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="One image URL per line"
                                        className="w-full resize-none border border-[#e3dfda] px-4 py-3 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Colors
                                    </label>

                                    <textarea
                                        name="colors"
                                        value={form.colors}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder={"Black|#000000\nWhite|#FFFFFF"}
                                        className="w-full resize-none border border-[#e3dfda] px-4 py-3 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full resize-none border border-[#e3dfda] px-4 py-3 text-sm outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="h-11 border border-[#e3dfda] px-7 text-[10px] font-medium uppercase tracking-[0.12em] transition hover:border-black disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="h-11 bg-black px-7 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#222] disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-[420px] bg-white p-7">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                            Delete Product
                        </p>

                        <h2 className="mt-2 font-serif text-2xl">
                            Are you sure?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Delete{" "}
                            <span className="font-medium text-black">
                                {getProductName(showDelete)}
                            </span>{" "}
                            permanently?
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowDelete(null)
                                }
                                disabled={Boolean(deletingId)}
                                className="h-11 border border-gray-200 text-[10px] font-medium uppercase tracking-0.1em disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={Boolean(deletingId)}
                                onClick={handleDelete}
                                className="h-11 bg-black text-[10px] font-medium uppercase tracking-0.1em text-white disabled:opacity-50"
                            >
                                {deletingId
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageProducts;