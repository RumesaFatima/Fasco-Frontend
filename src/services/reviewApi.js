const API_URL = `${import.meta.env.VITE_API_URL}/api/reviews`;

export const createReview = async (reviewData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to submit review."
        );
    }

    return data;
};


export const getProductReviews = async (productId) => {
    const response = await fetch(
        `${API_URL}/product/${productId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load reviews."
        );
    }

    return data;
};