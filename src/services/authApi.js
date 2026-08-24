const API_URL = "https://fasco-backend-two.vercel.app/api/auth";
export const signupUser = async (userData) => {
    const response = await fetch(
        `${API_URL}/signup`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    return response.json();
};

export const loginUser = async (userData) => {
    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    return response.json();
};

export const forgotPassword = async (email) => {
    const response = await fetch(
        `${API_URL}/forgot-password`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ email })
        }
    );

    return response.json();
};

export const resetPassword = async (token, password) => {
    const response = await fetch(
        `${API_URL}/reset-password/${token}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ password })
        }
    );

    return response.json();
};

export const googleLogin = async (credential) => {
    const response = await fetch(
        `${API_URL}/google`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ credential })
        }
    );

    return response.json();
};