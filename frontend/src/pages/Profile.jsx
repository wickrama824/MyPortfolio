import { useState, useEffect } from "react";
import "./Profile.css";

const DEFAULT_IMAGE = "/images/photo_2026-11-22_23-31-12.jpg";

const defaultProfile = {
    name: "Kulakshee",
    role: "IT Student",
    email: "kulaksheewickrama6@gmail.com",
    location: "Sri Lanka",
    about: "I'm passionate about web development and modern technologies.",
    image: DEFAULT_IMAGE,
    linkedin: "",
    github: ""
};

function Profile() {

    const [profile, setProfile] = useState(defaultProfile);
    const [profileId, setProfileId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // LOAD PROFILE FROM DATABASE
    useEffect(() => {

        async function fetchProfile() {

            try {

                const response = await fetch(
                    "https://kulakshee-portfolio-api.vercel.app/api/profile"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load profile");
                }

                if (data.profile) {

                    setProfileId(data.profile.id);

                    setProfile({
                        name: data.profile.name || "",
                        role: data.profile.title || "",
                        email: data.profile.email || "",
                        location: data.profile.location || "",
                        about: data.profile.description || "",
                        image: data.profile.profile_image || DEFAULT_IMAGE,
                        linkedin: data.profile.linkedin || "",
                        github: data.profile.github || ""
                    });

                }

            } catch (error) {

                console.error("Profile Loading Error:", error.message);
                setMessage("Unable to load profile. Please try again.");

            } finally {

                setLoading(false);

            }

        }

        fetchProfile();

    }, []);

    // HANDLE INPUT CHANGES
    function handleChange(e) {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

        setMessage("");

    }

    // IMAGE UPLOAD
    function handleImageChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image!");
            e.target.value = "";
            return;
        }

        if (file.size > 1.5 * 1024 * 1024) {
            alert("Please select an image smaller than 1.5MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {

            setProfile((prev) => ({
                ...prev,
                image: reader.result
            }));

            setMessage("");

        };

        reader.readAsDataURL(file);
        e.target.value = "";

    }

    // RESET IMAGE
    function resetImage() {

        setProfile((prev) => ({
            ...prev,
            image: DEFAULT_IMAGE
        }));

        setMessage("");

    }

    // SAVE PROFILE TO DATABASE
    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");
        setSaving(true);

        const token = localStorage.getItem("adminToken");

        if (!token) {

            setMessage("Please login again.");
            setSaving(false);
            return;

        }

        const profileData = {

            name: profile.name,
            title: profile.role,
            email: profile.email,
            location: profile.location,
            description: profile.about,
            profile_image: profile.image,
            linkedin: profile.linkedin,
            github: profile.github

        };

        try {

            const url = profileId
                ? `https://kulakshee-portfolio-api.vercel.app/api/profile/${profileId}`
                : "https://kulakshee-portfolio-api.vercel.app/api/profile";

            const response = await fetch(url, {

                method: profileId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(profileData)

            });

            const data = await response.json();

            if (response.status === 401) {

                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");

                window.location.href = "/admin/login";
                return;

            }

            if (!response.ok) {
                throw new Error(data.message || "Failed to save profile");
            }

            if (!profileId) {
                setProfileId(data.id);
            }

            setMessage("Profile updated successfully!");

        } catch (error) {

            console.error("Profile Save Error:", error.message);
            setMessage(error.message);

        } finally {

            setSaving(false);

        }

    }

    if (loading) {

        return (
            <div className="profile-page">
                <h2>Loading Profile...</h2>
            </div>
        );

    }

    return (

        <div className="profile-page">

            <div className="profile-header">

                <div>
                    <h1>Profile Management</h1>
                    <p>
                        Manage your personal information and profile photo.
                    </p>
                </div>

            </div>

            <form className="profile-form" onSubmit={handleSubmit}>

                {/* PROFILE PHOTO */}

                <div className="profile-photo-section">

                    <h2>Profile Photo</h2>

                    <p>
                        Upload a photo to display on your portfolio.
                    </p>

                    <div className="profile-photo-preview">

                        <img
                            src={profile.image || DEFAULT_IMAGE}
                            alt="Profile Preview"
                        />

                    </div>

                    <div className="profile-photo-buttons">

                        <label
                            htmlFor="profileImage"
                            className="upload-photo-btn"
                        >
                            ✎ Change Photo
                        </label>

                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <button
                            type="button"
                            className="reset-image-btn"
                            onClick={resetImage}
                        >
                            ↺ Reset
                        </button>

                    </div>

                </div>

                <div className="profile-divider"></div>

                {/* PERSONAL INFORMATION */}

                <h2>Personal Information</h2>

                <label>Full Name</label>

                <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                />

                <label>Job Title</label>

                <input
                    type="text"
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    required
                />

                <label>Email / Gmail</label>

                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                />

                <label>Location</label>

                <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                />

                <label>About Me</label>

                <textarea
                    name="about"
                    rows="5"
                    value={profile.about}
                    onChange={handleChange}
                />

                <div className="profile-divider"></div>

                {/* SOCIAL MEDIA LINKS */}

                <h2>Social Media Links</h2>

                <p>
                    Add your social media profile links to display on your portfolio.
                </p>

                <label>LinkedIn Profile URL</label>

                <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    placeholder="www.linkedin.com/in/kulakshee wickrama"
                />

                <label>GitHub Profile URL</label>

                <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    placeholder="https://github.com/wickrama824"
                />

                {message && (

                    <p className="profile-message">
                        {message}
                    </p>

                )}

                <button
                    type="submit"
                    className="save-profile-btn"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </form>

        </div>

    );

}

export default Profile;