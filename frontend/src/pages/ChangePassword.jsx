import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMessage({
            type: "",
            text: ""
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setMessage({
            type: "",
            text: ""
        });

        if (formData.newPassword.length < 8) {

            setMessage({
                type: "error",
                text: "New password must contain at least 8 characters."
            });

            return;

        }

        if (formData.newPassword !== formData.confirmPassword) {

            setMessage({
                type: "error",
                text: "New passwords do not match."
            });

            return;

        }

        setLoading(true);

        const token = localStorage.getItem("adminToken");

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    })
                }
            );

            const data = await response.json();

            if (response.status === 401 && data.message !== "Current password is incorrect") {

                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");

                navigate("/admin/login");
                return;

            }

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setMessage({
                type: "success",
                text: "Password changed successfully!"
            });

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            setMessage({
                type: "error",
                text: error.message
            });

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="change-password-page">

            <div className="change-password-header">

                <h1>Change Password</h1>

                <p>
                    Update your admin account password securely.
                </p>

            </div>

            <form
                className="change-password-form"
                onSubmit={handleSubmit}
            >

                <h2>Update Your Password</h2>

                <label>Current Password</label>

                <input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                />

                <label>New Password</label>

                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="8"
                    required
                />

                <label>Confirm New Password</label>

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="8"
                    required
                />

                {message.text && (

                    <p className={`password-message ${message.type}`}>
                        {message.text}
                    </p>

                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>

                <Link to="/admin" className="password-back-link">
                    ← Back to Dashboard
                </Link>

            </form>

        </div>

    );

}

export default ChangePassword;