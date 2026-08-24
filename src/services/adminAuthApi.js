const API_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
};

export const getAdminProfile = async () => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
};