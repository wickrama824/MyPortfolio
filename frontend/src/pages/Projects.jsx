import { useState, useEffect } from "react";
import "./project.css";

const API_URL = "https://kulakshee-portfolio-api.vercel.app/api/projects";

function Projects() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadProjects() {
        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load projects");
            }

            const data = await response.json();

            const formattedProjects = data.map((project, index) => ({
                id: project.id,
                title: project.title,
                description: project.description,
                technologies: project.technologies
                    ? project.technologies.split(",").map(tech => tech.trim())
                    : [],
                image: project.image,
                github: "#",
                demo: project.project_link || "#",
                number: String(index + 1).padStart(2, "0")
            }));

            setProjects(formattedProjects);

        } catch (error) {

            console.error("Projects Fetch Error:", error);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        loadProjects();

        function updateProjects() {
            loadProjects();
        }

        window.addEventListener("projectsUpdated", updateProjects);

        return () => {
            window.removeEventListener("projectsUpdated", updateProjects);
        };

    }, []);

    return (
        <section className="projects" id="projects">

            <div className="projects-heading">

                <span className="projects-label">MY RECENT WORK</span>

                <h1>
                    My <span>Projects</span>
                </h1>

                <p className="projects-description">
                    Explore some of the projects I've created
                    while learning and exploring new technologies.
                </p>

            </div>

            <div className="projects-container">

                {loading ? (

                    <p>Loading projects...</p>

                ) : projects.length === 0 ? (

                    <p>No projects available yet.</p>

                ) : (

                    projects.map((project) => (

                        <div className="project-card" key={project.id}>

                            <div className="project-image">

                                {project.image && (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                    />
                                )}

                                <span className="project-number">
                                    {project.number}
                                </span>

                                <div className="project-image-overlay">
                                    <span>PROJECT PREVIEW</span>
                                </div>

                            </div>

                            <div className="project-content">

                                <h2>{project.title}</h2>

                                <p>{project.description}</p>

                                <div className="project-technologies">

                                    {project.technologies.map((tech) => (
                                        <span key={tech}>{tech}</span>
                                    ))}

                                </div>

                                <div className="project-buttons">

                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="project-demo"
                                    >
                                        View Project ↗
                                    </a>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>
    );
}

export default Projects;