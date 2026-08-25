const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const json = (body) => ({
    method: "POST",
    body: JSON.stringify(body),
});

async function call(path, init = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(API_BASE + path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
            ...(init.headers || {}),
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            data.message || "Request failed. Please try again."
        );
    }

    return data;
}

export const api = {
    signup: (body) =>
        call("/auth/signup", json(body)),

    login: (body) =>
        call("/auth/login", json(body)),

    forgot: (body) =>
        call("/auth/forgot", json(body)),

    verify: (body) =>
        call("/auth/verify", json(body)),

    reset: (body) =>
        call("/auth/reset", json(body)),

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
            json({
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
            "/newsletter",
            json({
                email,
            })
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