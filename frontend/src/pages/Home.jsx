import { useState, useEffect } from "react";

function Home() {

    const images = [
        "/images/jakub-zerdzicki-FjtWczJWRlc-unsplash.jpg",
        "/images/jeferson-da-paulino-1fhzUGpPk5I-unsplash.jpg",
        "/images/johnny-guitar-f2krpIYBrJc-unsplash.jpg",
        "/images/jonathan-kemper-UF3vfhV04SA-unsplash.jpg",
        "/images/nubelson-fernandes-UcYBL5V0xWQ-unsplash.jpg"
    ];

    const defaultProfile = {
        name: "Kulakshee",
        role: "Software Engineering Student",
        about: "I'm passionate about programming, web development and exploring modern technologies. I enjoy learning new things, building creative projects and turning ideas into reality."
    };

    const [profile, setProfile] = useState(defaultProfile);

    const [currentImage, setCurrentImage] = useState(0);
    const [roleIndex, setRoleIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Fetch Profile Data from Backend
    useEffect(() => {

        async function fetchProfile() {
            try {
                const response = await fetch("http://localhost:5000/api/profile");
                const data = await response.json();

                if (data.success && data.profile) {
                    setProfile({
                        name: data.profile.name || defaultProfile.name,
                        role: data.profile.title || defaultProfile.role,
                        about: data.profile.description || defaultProfile.about
                    });
                }

            } catch (error) {
                console.error("Profile loading error:", error);
            }
        }

        fetchProfile();

    }, []);

    // Typing Animation Roles
    const roles = [
        profile.role,
        "Web Developer",
        "Tech Enthusiast",
        "Future Full Stack Developer"
    ];

    // Background Slideshow
    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentImage((previous) =>
                (previous + 1) % images.length
            );
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    // Typing Animation
    useEffect(() => {

        const currentRole = roles[roleIndex];

        let timeout;

        if (!deleting && typedText.length < currentRole.length) {

            timeout = setTimeout(() => {
                setTypedText(
                    currentRole.substring(0, typedText.length + 1)
                );
            }, 100);

        }

        else if (!deleting && typedText.length === currentRole.length) {

            timeout = setTimeout(() => {
                setDeleting(true);
            }, 1500);

        }

        else if (deleting && typedText.length > 0) {

            timeout = setTimeout(() => {
                setTypedText(
                    currentRole.substring(0, typedText.length - 1)
                );
            }, 50);

        }

        else if (deleting && typedText.length === 0) {

            setDeleting(false);
            setRoleIndex((previous) => (previous + 1) % roles.length);

        }

        return () => clearTimeout(timeout);

    }, [typedText, deleting, roleIndex, profile.role]);

    return (

        <section className="home" id="home">

            <div className="home-background">

                {images.map((image, index) => (

                    <div
                        key={image}
                        className={`home-bg-slide ${
                            currentImage === index ? "active" : ""
                        }`}
                        style={{
                            backgroundImage: `url("${image}")`
                        }}
                    />

                ))}

            </div>

            <div className="home-overlay"></div>

            <div className="home-content">

                <p className="welcome">
                    WELCOME TO MY PORTFOLIO
                </p>

                <h1>
                    Hi, I'm <span>{profile.name}</span>
                </h1>

                <h2 className="typing-heading">

                    <span className="typing-text">
                        {typedText}
                    </span>

                    <span className="typing-cursor">|</span>

                </h2>

                <p className="description">
                    {profile.about}
                </p>

                <div className="home-buttons">

                    <a href="#projects" className="primary-btn">
                        View My Work
                    </a>

                    <a href="#contact" className="secondary-btn">
                        Contact Me
                    </a>

                </div>

                <div className="slide-indicators">

                    {images.map((image, index) => (

                        <button
                            key={image}
                            className={
                                currentImage === index ? "active" : ""
                            }
                            onClick={() => setCurrentImage(index)}
                            aria-label={`Show image ${index + 1}`}
                        />

                    ))}

                </div>

            </div>

        </section>

    );
}

export default Home;