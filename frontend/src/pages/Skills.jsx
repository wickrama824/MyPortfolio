import { useState, useEffect } from "react";
import "./skills.css";

const categoryDescriptions = {
    "Frontend Development": "Creating beautiful and responsive user interfaces.",
    "Backend Development": "Building server-side applications and databases.",
    "Programming & Tools": "Exploring programming languages and development tools."
};

// Skill Logos
const skillIcons = {

    // Frontend
    "html": "html5/html5-original.svg",
    "html5": "html5/html5-original.svg",
    "css": "css3/css3-original.svg",
    "css3": "css3/css3-original.svg",
    "javascript": "javascript/javascript-original.svg",
    "js": "javascript/javascript-original.svg",
    "react": "react/react-original.svg",
    "react.js": "react/react-original.svg",
    "typescript": "typescript/typescript-original.svg",
    "bootstrap": "bootstrap/bootstrap-original.svg",
    "tailwind": "tailwindcss/tailwindcss-original.svg",
    "tailwind css": "tailwindcss/tailwindcss-original.svg",
    "sass": "sass/sass-original.svg",
    "next.js": "nextjs/nextjs-original.svg",

    // Backend
    "node.js": "nodejs/nodejs-original.svg",
    "nodejs": "nodejs/nodejs-original.svg",
    "express.js": "express/express-original.svg",
    "express": "express/express-original.svg",
    "php": "php/php-original.svg",
    "laravel": "laravel/laravel-original.svg",
    "django": "django/django-plain.svg",
    "spring": "spring/spring-original.svg",
    "mongodb": "mongodb/mongodb-original.svg",
    "mysql": "mysql/mysql-original.svg",
    "postgresql": "postgresql/postgresql-original.svg",
    "firebase": "firebase/firebase-original.svg",
    "redis": "redis/redis-original.svg",

    // Programming Languages
    "python": "python/python-original.svg",
    "java": "java/java-original.svg",
    "c": "c/c-original.svg",
    "c++": "cplusplus/cplusplus-original.svg",
    "c#": "csharp/csharp-original.svg",
    "ruby": "ruby/ruby-original.svg",
    "go": "go/go-original.svg",
    "rust": "rust/rust-original.svg",

    // Tools
    "git": "git/git-original.svg",
    "github": "github/github-original.svg",
    "linux": "linux/linux-original.svg",
    "docker": "docker/docker-original.svg",
    "vscode": "vscode/vscode-original.svg",
    "visual studio code": "vscode/vscode-original.svg",
    "figma": "figma/figma-original.svg",
    "npm": "npm/npm-original-wordmark.svg",
    "postman": "postman/postman-original.svg",
    "photoshop": "photoshop/photoshop-original.svg",
    "wordpress": "wordpress/wordpress-original.svg",
    "firebase tools": "firebase/firebase-original.svg"
};

// Default icon
const DEFAULT_ICON = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#8b5cf6"/>
        <text x="50" y="62"
            font-size="34"
            text-anchor="middle"
            fill="white"
            font-family="Arial"
            font-weight="bold">&lt;/&gt;</text>
    </svg>
`)}`;

// Get Skill Logo
function getSkillImage(skill) {

    if (skill.image) {

        if (
            skill.image.startsWith("http") ||
            skill.image.startsWith("/") ||
            skill.image.startsWith("data:")
        ) {
            return skill.image;
        }

        return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.image}`;
    }

    const skillName = skill.name
        ?.trim()
        .toLowerCase();

    const icon = skillIcons[skillName];

    return icon
        ? `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}`
        : DEFAULT_ICON;
}

function Skills() {

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Skills from Database
    useEffect(() => {

        async function fetchSkills() {

            try {

                const response = await fetch(
                    "https://kulakshee-portfolio-api.vercel.app/api/skills"
                );

                if (!response.ok) {
                    throw new Error("Failed to load skills");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setSkills(data);
                } else {
                    setSkills([]);
                }

            } catch (error) {

                console.error("Skills loading error:", error);

                setError(
                    "Unable to load skills. Please try again later."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchSkills();

    }, []);

    // Group Skills by Category
    const skillCategories = skills.reduce((categories, skill) => {

        const categoryName = skill.category || "Other Skills";

        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }

        categories[categoryName].push(skill);

        return categories;

    }, {});

    return (

        <section className="skills-section" id="skills">

            <div className="skills-heading">

                <span>WHAT I KNOW</span>

                <h2>
                    My <span>Technical Skills</span>
                </h2>

                <p>
                    Technologies and tools I'm learning and using
                    to build creative projects.
                </p>

            </div>

            {loading ? (

                <p style={{ textAlign: "center", color: "#c4b5fd" }}>
                    Loading skills...
                </p>

            ) : error ? (

                <p style={{ textAlign: "center", color: "#fca5a5" }}>
                    {error}
                </p>

            ) : skills.length === 0 ? (

                <p style={{ textAlign: "center", color: "#aaa" }}>
                    No skills available yet.
                </p>

            ) : (

                <div className="skills-container">

                    {Object.entries(skillCategories).map(
                        ([category, categorySkills], index) => (

                            <div
                                className="skill-category-card"
                                key={category}
                            >

                                <div className="skill-card-number">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <h3>{category}</h3>

                                <p className="skill-description">
                                    {categoryDescriptions[category] ||
                                        "Technologies and tools I'm learning and exploring."}
                                </p>

                                <div className="skill-items">

                                    {categorySkills.map((skill) => (

                                        <div
                                            className="skill-item"
                                            key={skill.id}
                                        >

                                            <div className="skill-icon">

                                                <img
                                                    src={getSkillImage(skill)}
                                                    alt={skill.name}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = DEFAULT_ICON;
                                                    }}
                                                />

                                            </div>

                                            <span>{skill.name}</span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>

    );

}

export default Skills;