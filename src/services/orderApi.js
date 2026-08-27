const API_URL = "https://fasco-backend-two.vercel.app/api/orders";

export const getUserOrders = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
};