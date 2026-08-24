import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signupUser } from "../services/authApi";
import GoogleButton from "../components/GoogleButton";

function EyeIcon({ open }) {
    return open ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="password-eye-icon"
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
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
            <path d="m3 3 18 18" />
            <path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3.1 4.1" />
            <path d="M6.7 6.7C3.7 8.7 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.2" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
    );
}

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        if (value.length <= 8) {
            setFormData({
                ...formData,
                password: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length !== 8) {
            setMessage("Password must be exactly 8 characters.");
            return;
        }

        const data = await signupUser(formData);

        setMessage(data.message);

        if (data.user) {
            setTimeout(() => {
                navigate("/login");
            }, 1200);
        }
    };

    return (
        <div className="auth-page">

            <div className="background-shape shape-one"></div>
            <div className="background-shape shape-two"></div>

            <div className="auth-card">

                <div className="auth-content">

                    <div className="auth-heading">

                        <span>Get Started</span>

                        <h1>Sign Up</h1>

                        <p>
                            Create your account in seconds.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <label>Full Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create 8 character password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    minLength={8}
                                    maxLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <EyeIcon
                                        open={showPassword}
                                    />
                                </button>

                            </div>

                            <div className="password-counter">
                                {formData.password.length}/8
                            </div>

                        </div>

                        <label className="terms">

                            <input
                                type="checkbox"
                                required
                            />

                            <span>
                                I agree to the Terms of Service
                                and Privacy Policy
                            </span>

                        </label>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Create Account
                        </button>

                    </form>

                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                    <div className="auth-switch">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <div className="google-container">
                        <GoogleButton />
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;