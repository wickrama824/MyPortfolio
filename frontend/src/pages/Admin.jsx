import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalProjects: 0,
        totalSkills: 0,
        totalMessages: 0
    });

    const [loading, setLoading] = useState(true);

    // FETCH DASHBOARD STATS
    useEffect(() => {

        const fetchStats = async () => {

            try {

                const token = localStorage.getItem("adminToken");

                const response = await fetch(
                    "https://kulakshee-portfolio-api.vercel.app/api/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("admin");
                    navigate("/admin/login");
                    return;
                }

                if (response.ok) {

                    setStats({
                        totalProjects: data.totalProjects || 0,
                        totalSkills: data.totalSkills || 0,
                        totalMessages: data.totalMessages || 0
                    });

                }

            } catch (error) {

                console.error("Dashboard Fetch Error:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchStats();

    }, [navigate]);


    // LOGOUT
    function handleLogout() {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");

    }


    return (

        <div className="admin-dashboard">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="dashboard-logo">
                    <h2>My Portfolio</h2>
                </div>

                <h3 className="sidebar-title">
                    ADMIN PANEL
                </h3>

                <ul>

                    <li>
                        <Link
                            to="/admin"
                            className="sidebar-link"
                        >
                            🏠 Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/profile"
                            className="sidebar-link"
                        >
                            👤 Profile
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/skills"
                            className="sidebar-link"
                        >
                            💻 Skills
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/projects"
                            className="sidebar-link"
                        >
                            📁 Projects
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/education"
                            className="sidebar-link"
                        >
                            🎓 Education
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/messages"
                            className="sidebar-link"
                        >
                            💬 Messages
                        </Link>
                    </li>

                    {/* CHANGE PASSWORD */}

                    <li>
                        <Link
                            to="/admin/change-password"
                            className="sidebar-link"
                        >
                            🔐 Change Password
                        </Link>
                    </li>

                </ul>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <Link
                        to="/"
                        className="sidebar-link"
                    >
                        🌐 Back to Portfolio
                    </Link>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="dashboard-main">

                {/* HEADER */}

                <div className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Welcome to your Portfolio Admin Panel!
                        </p>
                    </div>

                    <div className="admin-profile">
                        <span>👤 Admin</span>
                    </div>

                </div>


                {/* DASHBOARD STATS */}

                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            📁
                        </div>

                        <div>
                            <h3>Projects</h3>

                            <h2>
                                {loading ? "..." : stats.totalProjects}
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            💻
                        </div>

                        <div>
                            <h3>Skills</h3>

                            <h2>
                                {loading ? "..." : stats.totalSkills}
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            💬
                        </div>

                        <div>
                            <h3>Messages</h3>

                            <h2>
                                {loading ? "..." : stats.totalMessages}
                            </h2>
                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="quick-actions">

                    <h2>Quick Actions</h2>

                    <div className="action-container">


                        {/* PROFILE */}

                        <div className="action-card">

                            <h3>👤 Manage Profile</h3>

                            <p>
                                Update your personal information,
                                profile image and social media links.
                            </p>

                            <Link
                                to="/admin/profile"
                                className="action-link"
                            >
                                Edit Profile →
                            </Link>

                        </div>


                        {/* SKILLS */}

                        <div className="action-card">

                            <h3>💻 Manage Skills</h3>

                            <p>
                                Add, update and delete your
                                technical skills.
                            </p>

                            <Link
                                to="/admin/skills"
                                className="action-link"
                            >
                                Manage Skills →
                            </Link>

                        </div>


                        {/* PROJECTS */}

                        <div className="action-card">

                            <h3>📁 Manage Projects</h3>

                            <p>
                                Add new projects, upload images
                                and update project details.
                            </p>

                            <Link
                                to="/admin/projects"
                                className="action-link"
                            >
                                Manage Projects →
                            </Link>

                        </div>


                        {/* EDUCATION */}

                        <div className="action-card">

                            <h3>🎓 Manage Education</h3>

                            <p>
                                Add and update your educational
                                qualifications.
                            </p>

                            <Link
                                to="/admin/education"
                                className="action-link"
                            >
                                Manage Education →
                            </Link>

                        </div>


                        {/* MESSAGES */}

                        <div className="action-card">

                            <h3>💬 Manage Messages</h3>

                            <p>
                                View messages sent by visitors
                                through your portfolio.
                            </p>

                            <Link
                                to="/admin/messages"
                                className="action-link"
                            >
                                View Messages →
                            </Link>

                        </div>


                        {/* CHANGE PASSWORD */}

                        <div className="action-card">

                            <h3>🔐 Change Password</h3>

                            <p>
                                Update your admin account password
                                securely.
                            </p>

                            <Link
                                to="/admin/change-password"
                                className="action-link"
                            >
                                Change Password →
                            </Link>

                        </div>


                    </div>

                </section>

            </main>

        </div>

    );

}

export default Admin;