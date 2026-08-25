import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { googleLogin } from "../services/authApi";

function GoogleButton() {
    const navigate = useNavigate();
    const { setUser, toast } = useStore();
    const handleGoogleSuccess = async (credentialResponse) => {

        const data = await googleLogin(
            credentialResponse.credential
        );

        if (data.token) {

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
            setUser(data.user, data.token);

            toast(
                data.message || "Google login successful.",
                "success"
            );

            navigate("/dashboard");
        }

        if (data.message && !data.token) {
            toast(data.message,"error");
        }
    };

    const handleGoogleError = () => {
        toast(
            "Google login failed. Please try again.",
            "error"
        );
    };

    return (
        <div className="google-button">

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
            />

        </div>
    );
}

export default GoogleButton;