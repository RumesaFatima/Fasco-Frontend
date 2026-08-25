import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { forgotPassword } from "../services/authApi";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const { toast } = useStore();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await forgotPassword(email);

            toast(
                data?.message || "Password reset link sent successfully.",
                "success"
            );

        } catch (error) {
            console.error("Forgot Password Error:", error);

            toast(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to send reset link. Please try again.",
                "error"
            );
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

                        <h1>Forgot Password?</h1>

                        <p>
                            Enter your email and we'll send
                            you a reset link.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Send Reset Link
                        </button>

                    </form>

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

export default ForgotPassword;