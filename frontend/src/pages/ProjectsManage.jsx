import { useState, useEffect } from "react";
import "./ProjectsManage.css";

const API_URL = "http://localhost:5000/api/projects";

const defaultProjects = [
    {
        title: "Personal Portfolio",
        description: "A personal portfolio website built using HTML and CSS.",
        technologies: "HTML, CSS",
        project_link: "#"
    },
    {
        title: "Pet Health Monitoring System",
        description: "An AI-powered system for monitoring pet health.",
        technologies: "React, Node.js, MySQL",
        project_link: "#"
    },
    {
        title: "Web Development Project",
        description: "A responsive website created to practice frontend development.",
        technologies: "HTML, CSS, JavaScript",
        project_link: "#"
    }
];

function ProjectsManage() {

    const [projects, setProjects] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tech: "",
        link: "",
        image: ""
    });

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("adminToken");

    // LOAD PROJECTS
    async function loadProjects() {

        try {

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !Array.isArray(data)) {
                throw new Error("Failed to load projects.");
            }

            if (data.length === 0 && token) {

                for (const project of defaultProjects) {

                    const seedResponse = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title: project.title,
                            description: project.description,
                            technologies: project.technologies,
                            image: null,
                            project_link: project.project_link
                        })
                    });

                    if (!seedResponse.ok) {
                        throw new Error("Failed to save default projects.");
                    }
                }

                const updatedResponse = await fetch(API_URL);
                const updatedData = await updatedResponse.json();

                setProjects(updatedData);

            } else {

                setProjects(data);

            }

        } catch (error) {

            console.error("Projects Loading Error:", error);
            alert(error.message);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    // HANDLE TEXT INPUTS
    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    // HANDLE IMAGE UPLOAD
    function handleImageChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file!");
            e.target.value = "";
            return;
        }

        if (file.size > 1.5 * 1024 * 1024) {
            alert("Image size must be less than 1.5MB!");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {

            setFormData(previous => ({
                ...previous,
                image: reader.result
            }));

        };

        reader.readAsDataURL(file);

    }

    // RESET FORM
    function resetForm() {

        setFormData({
            title: "",
            description: "",
            tech: "",
            link: "",
            image: ""
        });

        setEditId(null);

    }

    // ADD / UPDATE PROJECT
    async function handleSubmit(e) {

        e.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.tech.trim()
        ) {

            alert("Please fill all required fields!");
            return;

        }

        if (!token) {

            alert("Please login again.");
            return;

        }

        setSaving(true);

        const projectData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            technologies: formData.tech.trim(),
            image: formData.image || null,
            project_link: formData.link.trim()
        };

        try {

            const url = editId !== null
                ? `${API_URL}/${editId}`
                : API_URL;

            const response = await fetch(url, {

                method: editId !== null ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(projectData)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save project.");
            }

            alert(
                editId !== null
                    ? "Project updated successfully!"
                    : "Project added successfully!"
            );

            resetForm();

            await loadProjects();

            window.dispatchEvent(new Event("projectsUpdated"));

        } catch (error) {

            console.error("Project Save Error:", error);
            alert(error.message);

        } finally {

            setSaving(false);

        }

    }

    // EDIT PROJECT
    function handleEdit(project) {

        setFormData({
            title: project.title || "",
            description: project.description || "",
            tech: project.technologies || "",
            link: project.project_link || "",
            image: project.image || ""
        });

        setEditId(project.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // DELETE PROJECT
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API_URL}/${id}`, {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete project.");
            }

            setProjects(previous =>
                previous.filter(project => project.id !== id)
            );

            alert("Project deleted successfully!");

            window.dispatchEvent(new Event("projectsUpdated"));

        } catch (error) {

            console.error("Project Delete Error:", error);
            alert(error.message);

        }

    }

    // CANCEL EDITING
    function handleCancel() {
        resetForm();
    }

    return (

        <div className="projects-manage">

            <div className="manage-header">
                <h1>Projects Management</h1>
                <p>Add, edit and manage your portfolio projects.</p>
            </div>

            {/* PROJECT FORM */}

            <div className="project-form-container">

                <h2>
                    {editId !== null ? "Edit Project" : "Add New Project"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Project Title *</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter project title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description *</label>

                    <textarea
                        name="description"
                        placeholder="Enter project description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <label>Technologies Used *</label>

                    <input
                        type="text"
                        name="tech"
                        placeholder="Example: React, Node.js, MySQL"
                        value={formData.tech}
                        onChange={handleChange}
                        required
                    />

                    <label>Project Link</label>

                    <input
                        type="text"
                        name="link"
                        placeholder="Enter project URL"
                        value={formData.link}
                        onChange={handleChange}
                    />

                    {/* IMAGE UPLOAD */}

                    <label>Project Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    {/* IMAGE PREVIEW */}

                    {formData.image && (

                        <div className="project-image-preview">

                            <p>Image Preview</p>

                            <img
                                src={formData.image}
                                alt="Project Preview"
                            />

                        </div>

                    )}

                    <div className="project-form-buttons">

                        <button type="submit" disabled={saving}>

                            {saving
                                ? "Saving..."
                                : editId !== null
                                    ? "Update Project"
                                    : "Add Project"}

                        </button>

                        {editId !== null && (

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* PROJECTS LIST */}

            <div className="projects-list">

                <h2>My Projects ({projects.length})</h2>

                <div className="projects-manage-container">

                    {loading ? (

                        <p>Loading projects...</p>

                    ) : projects.length === 0 ? (

                        <p>No projects available yet.</p>

                    ) : (

                        projects.map((project) => (

                            <div
                                className="manage-project-card"
                                key={project.id}
                            >

                                {project.image && (

                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="manage-project-image"
                                    />

                                )}

                                <h3>{project.title}</h3>

                                <p>{project.description}</p>

                                <h4>{project.technologies}</h4>

                                <div className="project-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default ProjectsManage;