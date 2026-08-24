import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../services/authApi";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (password.length !== 8) {
            setMessage("Password must be exactly 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword(token, password);

            setMessage(data.message);

            if (data.message === "Password reset successful") {
                setTimeout(() => {
                    navigate("/login");
                }, 1200);
            }
        } catch (error) {
            setMessage("Unable to reset password. Please try again.");
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

                        <span>Password Recovery</span>

                        <h1>Reset Password</h1>

                        <p>
                            Create a new password for your account.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <label>
                                New Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value.slice(0, 8)
                                        )
                                    }
                                    minLength={8}
                                    maxLength={8}
                                    autoComplete="new-password"
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
                                        /* Eye OFF */
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
                                        /* Eye ON */
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

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>

                    </form>

                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                    <div className="back-link">

                        <Link to="/login">
                            ← Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;