import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { googleLogin } from "../services/authApi";

function GoogleButton() {
    const navigate = useNavigate();

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

            console.log("Google login successful");

            navigate("/dashboard");
        }

        console.log(data.message);
    };

    const handleGoogleError = () => {
        console.log("Google login failed");
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