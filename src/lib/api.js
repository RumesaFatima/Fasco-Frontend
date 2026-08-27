const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://fasco-backend-two.vercel.app/api"
).replace(/\/+$/, "");

async function call(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    let response;

    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers,
        });
    } catch {
        throw new Error(
            "Failed to fetch. Please check your internet connection."
        );
    }

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : await response.text().catch(() => "");

    if (!response.ok) {
        const message =
            typeof data === "object" && data?.message
                ? data.message
                : typeof data === "string" && data
                    ? data
                    : `Request failed (${response.status})`;

        throw new Error(message);
    }

    return data;
}

const post = (body) => ({
    method: "POST",
    body: JSON.stringify(body),
});

export const api = {
    signup: (body) => call("/auth/signup", post(body)),

    login: (body) => call("/auth/login", post(body)),

    forgot: (body) => call("/auth/forgot", post(body)),

    verify: (body) => call("/auth/verify", post(body)),

    reset: (body) => call("/auth/reset", post(body)),

    products: (query = {}) => {
        const params = new URLSearchParams();

        if (query.search) {
            params.set("search", query.search);
        }

        if (query.category && query.category !== "All") {
            params.set("category", query.category);
        }

        if (query.sort) {
            params.set("sort", query.sort);
        }

        const queryString = params.toString();

        return call(
            `/products${queryString ? `?${queryString}` : ""}`
        );
    },

    addOrder: (email, order) =>
        call(
            "/orders",
            post({
                ...order,
                email,
            })
        ),

    orders: (email) =>
        call(
            `/orders?email=${encodeURIComponent(email)}`
        ),

    subscribe: (email) =>
        call(
            "/newsletter/subscribe",
            post({
                email,
            })
        ),

    addReview: (body) =>
        call("/reviews", post(body)),

    reviews: (productId) =>
        call(
            `/reviews/product/${encodeURIComponent(productId)}`
        ),
};

export function getSession() {
    try {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");

        if (!token || !rawUser) {
            return null;
        }

        return {
            token,
            user: JSON.parse(rawUser),
        };
    } catch {
        return null;
    }
}

export function saveSession(res) {
    if (!res) return;

    if (res.token) {
        localStorage.setItem("token", res.token);
    }

    if (res.user) {
        localStorage.setItem(
            "user",
            JSON.stringify(res.user)
        );
    }
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("fasco_session");
}