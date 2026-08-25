import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authApi";
import GoogleButton from "../components/GoogleButton";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            setMessage(data.message || "");

            if (!data.token) {
                return;
            }

            // Save token
            localStorage.setItem("token", data.token);

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            if (data.user?.isAdmin === true) {
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("admin", JSON.stringify(data.user));

                navigate("/admin");
                return;
            }
            
            navigate("/dashboard");

        } catch (error) {
            console.error("Login Error:", error);

            setMessage(
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="background-shape shape-one"></div>
            <div className="background-shape shape-two"></div>

            <div className="auth-card">

                <div className="auth-content">

                    <div className="auth-heading">

                        <span>Welcome Back</span>

                        <h1>Login</h1>

                        <p>
                            Please enter your details to sign in.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    minLength={8}
                                    maxLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="password-eye-icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.58 10.58a2 2 0 002.84 2.84"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.88 4.24A9.86 9.86 0 0112 4c5 0 8.73 4.11 10 8a13.5 13.5 0 01-3.05 5.03"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.61 6.61C4.64 7.94 3.31 9.82 2 12c1.27 3.89 5 8 10 8 1.61 0 3.09-.4 4.39-1.11"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="password-eye-icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 12s3.75-7 9.75-7 9.75 7 9.75 7-3.75 7-9.75 7-9.75-7-9.75-7z"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <small className="password-hint">
                                Password must be exactly 8 characters.
                            </small>

                        </div>

                        <div className="form-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Keep me logged in
                                </span>

                            </label>

                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>

                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                    <div className="auth-switch">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/signup">
                            Sign up
                        </Link>

                    </div>


                    <div className="divider">

                        <span>
                            or continue with
                        </span>

                    </div>


                    <div className="google-container">
                        <GoogleButton />
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;