import { useState, useEffect } from "react";
import "./About.css";

const DEFAULT_IMAGE = "/images/photo_2026-11-22_23-31-12.jpg";

const defaultProfile = {
    name: "Kulakshee",
    role: "Software Engineering Student",
    email: "yourname@gmail.com",
    location: "Sri Lanka",
    about: "I'm passionate about web development and modern technologies.",
    image: DEFAULT_IMAGE
};

function About() {

    const [profile, setProfile] = useState(defaultProfile);

    // Fetch Profile Data from Backend
    useEffect(() => {

        async function fetchProfile() {

            try {

                const response = await fetch(
                    "https://kulakshee-portfolio-api.vercel.app/api/profile"
                );

                const data = await response.json();

                if (data.success && data.profile) {

                    setProfile({
                        name: data.profile.name || defaultProfile.name,
                        role: data.profile.title || defaultProfile.role,
                        email: data.profile.email || defaultProfile.email,
                        location: data.profile.location || defaultProfile.location,
                        about: data.profile.description || defaultProfile.about,
                        image: data.profile.profile_image || DEFAULT_IMAGE
                    });

                }

            } catch (error) {

                console.error("Profile loading error:", error);

            }

        }

        fetchProfile();

    }, []);

    return (

        <section className="about" id="about">

            {/* Background Decorations */}

            <div className="about-glow about-glow-one"></div>
            <div className="about-glow about-glow-two"></div>
            <div className="about-glow about-glow-three"></div>

            {/* Main Container */}

            <div className="about-container">

                {/* Profile Image Side */}

                <div className="about-image-side">

                    <div className="about-image-wrapper">

                        <div className="about-image-border">

                            <div className="about-image-inner">

                                <img
                                    src={profile.image || DEFAULT_IMAGE}
                                    alt={profile.name}
                                />

                            </div>

                        </div>

                        <div className="about-image-glow"></div>

                    </div>

                    {/* Floating Badge */}

                    <div className="about-floating-badge">

                        <span className="badge-dot"></span>

                        <div>
                            <strong>Open to Learn</strong>
                            <small>Always Exploring</small>
                        </div>

                    </div>

                    {/* Decorative Circle */}

                    <div className="about-decoration-circle"></div>

                </div>

                {/* About Content */}

                <div className="about-content-card">

                    <div className="about-heading">

                        <span className="about-label">
                            GET TO KNOW ME
                        </span>

                        <h1>
                            About <span>Me</span>
                        </h1>

                        <div className="about-heading-line"></div>

                    </div>

                    <h3 className="about-role">
                        {profile.role}
                    </h3>

                    <p className="about-description">
                        {profile.about}
                    </p>

                    {/* Information Cards */}

                    <div className="about-info-grid">

                        <div className="about-info-card">

                            <div className="info-icon">
                                👤
                            </div>

                            <div>
                                <span>Name</span>
                                <h4>{profile.name}</h4>
                            </div>

                        </div>

                        <div className="about-info-card">

                            <div className="info-icon">
                                💻
                            </div>

                            <div>
                                <span>Role</span>
                                <h4>{profile.role}</h4>
                            </div>

                        </div>

                        <div className="about-info-card">

                            <div className="info-icon">
                                📍
                            </div>

                            <div>
                                <span>Location</span>
                                <h4>{profile.location}</h4>
                            </div>

                        </div>

                    </div>

                    {/* Connect Button */}

                    <div className="about-actions">

                        <a href="#contact" className="about-btn">

                            Let's Connect

                            <span>→</span>

                        </a>

                        <span className="about-extra-text">
                            Let's build something amazing!
                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default About;