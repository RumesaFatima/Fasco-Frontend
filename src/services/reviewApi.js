const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://fasco-backend-bzmjzvi6c-webcoder12.vercel.app/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body
                ? {
                    "Content-Type": "application/json",
                }
                : {}),
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
            ...(options.headers || {}),
        },
    });

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : await response.text().catch(() => "");

    if (!response.ok) {
        throw new Error(
            typeof data === "object" && data?.message
                ? data.message
                : typeof data === "string" && data
                    ? data
                    : `Request failed (${response.status})`
        );
    }

    return data;
}

export async function addReview(body) {
    return request("/reviews", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function getProductReviews(productId) {
    return request(
        `/reviews/product/${encodeURIComponent(productId)}`
    );
}

export async function getAllReviews() {
    const token = localStorage.getItem("adminToken");

    return request("/reviews/admin/all", {
        method: "GET",
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {},
    });
}