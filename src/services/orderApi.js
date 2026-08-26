const API_URL = "https://fasco-backend-two.vercel.app/api/orders";

export const getUserOrders = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
};