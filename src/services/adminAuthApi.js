const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("adminToken");

const request = async (url, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
};

export const adminLogin = async (email, password) => {
    return request("/admin/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
};

export const getAdminProfile = async () => {
    return request("/admin/profile");
};

export const getDashboardStats = async () => {
    return request("/admin/dashboard");
};