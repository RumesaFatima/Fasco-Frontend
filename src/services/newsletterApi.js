const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://fasco-backend-bzmjzvi6c-webcoder12.vercel.app/api"
).replace(/\/+$/, "");

export async function subscribeNewsletter(email) {
    const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ email }),
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

export async function getNewsletterSubscribers() {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_BASE}/newsletter/subscribers`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
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