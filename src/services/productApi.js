const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://fasco-backend-two.vercel.app/api"
).replace(/\/+$/, "");

const getAdminToken = () =>
    localStorage.getItem("adminToken");

const request = async (endpoint, options = {}) => {
    const token = getAdminToken();

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,

            headers: {
                Accept: "application/json",

                ...(options.body
                    ? {
                        "Content-Type":
                            "application/json",
                    }
                    : {}),

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`,
                    }
                    : {}),

                ...(options.headers || {}),
            },
        }
    );

    const contentType =
        response.headers.get("content-type") || "";

    const data =
        contentType.includes("application/json")
            ? await response.json().catch(() => ({}))
            : await response.text().catch(() => "");

    if (!response.ok) {
        throw new Error(
            data?.message ||
            `Request failed (${response.status})`
        );
    }

    return data;
};
export const getProducts = async () => {
    return request("/admin/products");
};

export const getProductById = async (productId) => {
    return request(`/admin/products/${productId}`);
};

export const createProduct = async (productData) => {
    return request("/admin/products", {
        method: "POST",
        body: JSON.stringify(productData),
    });
};

export const updateProduct = async (
    productId,
    productData
) => {
    return request(
        `/admin/products/${productId}`,
        {
            method: "PUT",
            body: JSON.stringify(productData),
        }
    );
};

export const deleteProduct = async (productId) => {
    return request(
        `/admin/products/${productId}`,
        {
            method: "DELETE",
        }
    );
};