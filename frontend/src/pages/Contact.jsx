import { useState, useEffect } from "react";
import "./Contact.css";

const API_URL = "https://kulakshee-portfolio-api.vercel.app/api/messages";
const PROFILE_API = "https://kulakshee-portfolio-api.vercel.app/api/profile";

function Contact() {

    const [profile, setProfile] = useState({
        email: "",
        location: "Sri Lanka",
        github: "",
        linkedin: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState({
        type: "",
        message: ""
    });

    // LOAD PROFILE DETAILS
    useEffect(() => {

        async function fetchProfile() {

            try {

                const response = await fetch(PROFILE_API);
                const data = await response.json();

                if (response.ok && data.profile) {

                    setProfile({
                        email: data.profile.email || "",
                        location: data.profile.location || "Sri Lanka",
                        github: data.profile.github || "",
                        linkedin: data.profile.linkedin || ""
                    });

                }

            } catch (error) {

                console.error("Profile Loading Error:", error);

            }

        }

        fetchProfile();

    }, []);

    // HANDLE FORM INPUTS
    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    // SEND MESSAGE
    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setStatus({
            type: "",
            message: ""
        });

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send message.");
            }

            setStatus({
                type: "success",
                message: "Your message has been sent successfully!"
            });

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (error) {

            console.error("Contact Form Error:", error);

            setStatus({
                type: "error",
                message: error.message || "Something went wrong. Please try again."
            });

        } finally {

            setLoading(false);

        }

    }

    return (

        <section className="contact" id="contact">

            {/* Animated Background Effects */}

            <div className="contact-bg-glow glow-one"></div>
            <div className="contact-bg-glow glow-two"></div>
            <div className="contact-bg-glow glow-three"></div>

            {/* Heading */}

            <div className="contact-heading">

                <span className="contact-label">
                    GET IN TOUCH
                </span>

                <h1>
                    Contact <span>Me</span>
                </h1>

                <p className="contact-description">
                    Have a project idea or want to connect?
                    I'd love to hear from you.
                </p>

            </div>

            {/* Main Container */}

            <div className="contact-container">

                {/* LEFT SIDE */}

                <div className="contact-info">

                    <div className="contact-info-heading">

                        <span className="contact-small-label">
                            LET'S TALK
                        </span>

                        <h2>
                            Let's Connect<span>!</span>
                        </h2>

                        <p>
                            I'm always interested in learning,
                            collaborating and exploring new opportunities.
                            Feel free to reach out!
                        </p>

                    </div>

                    {/* CONTACT INFORMATION */}

                    <div className="contact-info-cards">

                        {/* EMAIL */}

                        <div className="contact-info-card">

                            <div className="contact-icon">
                                ✉
                            </div>

                            <div>

                                <span>Email Address</span>

                                <h3>
                                    {profile.email || "Email not added"}
                                </h3>

                            </div>

                        </div>

                        {/* LOCATION */}

                        <div className="contact-info-card">

                            <div className="contact-icon">
                                📍
                            </div>

                            <div>

                                <span>Location</span>

                                <h3>
                                    {profile.location}
                                </h3>

                            </div>

                        </div>

                        {/* SOCIAL MEDIA */}

                        <div className="contact-info-card">

                            <div className="contact-icon">
                                💻
                            </div>

                            <div>

                                <span>Social Media</span>

                                <h3>
                                    Let's Connect Online
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* SOCIAL LINKS */}

                    <div className="contact-socials">

                        {profile.email && (

                            <a href={`mailto:${profile.email}`}>
                                Gmail ↗
                            </a>

                        )}

                        {profile.github && (

                            <a
                                href={profile.github}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub ↗
                            </a>

                        )}

                        {profile.linkedin && (

                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn ↗
                            </a>

                        )}

                    </div>

                </div>

                {/* RIGHT SIDE - CONTACT FORM */}

                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-heading">

                        <h2>Send Me a Message</h2>

                        <p>
                            Have something in mind?
                            Let's talk about it.
                        </p>

                    </div>

                    <div className="form-group">

                        <label>Your Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Your Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Subject</label>

                        <input
                            type="text"
                            name="subject"
                            placeholder="What is this about?"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Your Message</label>

                        <textarea
                            name="message"
                            placeholder="Write your message here..."
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                    </div>

                    {/* SUCCESS / ERROR MESSAGE */}

                    {status.message && (

                        <p
                            role="status"
                            className={`contact-status ${status.type}`}
                        >
                            {status.message}
                        </p>

                    )}

                    <button
                        type="submit"
                        className="contact-submit-btn"
                        disabled={loading}
                    >

                        {loading ? "Sending..." : "Send Message"}

                        <span>→</span>

                    </button>

                    <p className="contact-form-note">
                        I'll be happy to hear from you!
                    </p>

                </form>

            </div>

        </section>

    );

}

export default Contact;