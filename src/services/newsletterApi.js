const API_URL = "https://fasco-backend-bzmjzvi6c-webcoder12.vercel.app/api";
export const subscribeNewsletter = async (email) => {
    const response = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe");
    }

    return data;
};