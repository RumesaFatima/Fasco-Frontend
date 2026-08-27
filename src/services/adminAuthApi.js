const API_URL = import.meta.env.VITE_API_BASE_URL
const getToken = () => localStorage.getItem("adminToken");

export const adminLogin = async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};

export const getAdminProfile = async () => {
    const token = getToken();

    const response = await fetch(`${API_URL}/admin/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
};

export const getDashboardStats = async () => {
    const token = getToken();

    const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
};