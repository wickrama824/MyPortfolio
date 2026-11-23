
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://kulakshee-portfolio-api.vercel.app/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed!"
                );
            }

            // Save JWT Token
            localStorage.setItem("adminToken", data.token);

            // Save Admin Details
            localStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            alert("Login Successful!");

            navigate("/admin");

        } catch (error) {

            setError(
                error.message === "Failed to fetch"
                    ? "Cannot connect to server. Please try again."
                    : error.message
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            <div className="login-container">

                <div className="login-logo">
                    Kulakshee<span>.</span>
                </div>

                <p className="login-subtitle">
                    ADMIN PANEL
                </p>

                <h1>Welcome Back!</h1>

                <p className="login-description">
                    Login to manage your portfolio.
                </p>

                <form onSubmit={handleLogin}>

                    <label>Admin Username</label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <div className="password-container">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="show-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>

                    </div>

                    {error && (
                        <p style={{
                            color: "#ff6b81",
                            fontSize: "14px",
                            marginTop: "12px"
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <Link to="/" className="back-home">
                    ← Back to Portfolio
                </Link>

            </div>

        </div>
    );
}

export default AdminLogin;