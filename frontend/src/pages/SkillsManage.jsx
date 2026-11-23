import { useState, useEffect } from "react";
import "./SkillsManage.css";

const API_URL = "https://kulakshee-portfolio-api.vercel.app/api/skills";

const defaultSkills = [
    { name: "HTML", category: "Frontend Development" },
    { name: "CSS", category: "Frontend Development" },
    { name: "JavaScript", category: "Frontend Development" },
    { name: "React", category: "Frontend Development" },
    { name: "Node.js", category: "Backend Development" },
    { name: "MongoDB", category: "Backend Development" },
    { name: "Python", category: "Programming & Tools" },
    { name: "SQL", category: "Programming & Tools" }
];

function SkillsManage() {

    const [skills, setSkills] = useState([]);

    const [skillName, setSkillName] = useState("");
    const [category, setCategory] = useState("Frontend Development");

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("adminToken");

    // Load Skills from Database
    async function loadSkills() {

        try {

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !Array.isArray(data)) {
                throw new Error("Failed to load skills");
            }

            // Insert previous default skills only if database is empty
            if (data.length === 0) {

                for (const skill of defaultSkills) {

                    const seedResponse = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: skill.name,
                            category: skill.category,
                            image: null
                        })
                    });

                    if (!seedResponse.ok) {
                        throw new Error("Failed to save default skills");
                    }

                }

                // Fetch again after inserting default skills
                const updatedResponse = await fetch(API_URL);
                const updatedData = await updatedResponse.json();

                setSkills(updatedData);

            } else {

                setSkills(data);

            }

        } catch (error) {

            console.error("Skills loading error:", error);
            alert(error.message || "Unable to load skills.");

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSkills();

    }, []);

    // Add or Update Skill
    async function handleSubmit(e) {

        e.preventDefault();

        if (!skillName.trim()) {
            alert("Please enter a skill name!");
            return;
        }

        if (!token) {
            alert("Please login again.");
            return;
        }

        setSaving(true);

        const skillData = {
            name: skillName.trim(),
            category,
            image: null
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
                body: JSON.stringify(skillData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save skill");
            }

            alert(
                editId !== null
                    ? "Skill updated successfully!"
                    : "Skill added successfully!"
            );

            setSkillName("");
            setCategory("Frontend Development");
            setEditId(null);

            await loadSkills();

        } catch (error) {

            console.error("Skill save error:", error);
            alert(error.message);

        } finally {

            setSaving(false);

        }

    }

    // Edit Skill
    function handleEdit(skill) {

        setSkillName(skill.name);
        setCategory(skill.category || "Frontend Development");
        setEditId(skill.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // Delete Skill
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this skill?"
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
                throw new Error(data.message || "Failed to delete skill");
            }

            setSkills(previous =>
                previous.filter(skill => skill.id !== id)
            );

            alert("Skill deleted successfully!");

        } catch (error) {

            console.error("Skill delete error:", error);
            alert(error.message);

        }

    }

    // Cancel Edit
    function handleCancel() {

        setEditId(null);
        setSkillName("");
        setCategory("Frontend Development");

    }

    return (

        <div className="skills-manage">

            <div className="manage-header">

                <h1>Skills Management</h1>

                <p>Manage your technical skills here.</p>

            </div>

            {/* Add Skill Form */}

            <div className="skill-form-container">

                <h2>
                    {editId !== null ? "Edit Skill" : "Add New Skill"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter skill name"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option value="Frontend Development">
                            Frontend Development
                        </option>

                        <option value="Backend Development">
                            Backend Development
                        </option>

                        <option value="Programming & Tools">
                            Programming & Tools
                        </option>

                    </select>

                    <button type="submit" disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editId !== null
                                ? "Update Skill"
                                : "Add Skill"
                        }
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

                </form>

            </div>

            {/* Skills List */}

            <div className="skills-list">

                <h2>
                    My Skills ({skills.length})
                </h2>

                <div className="skills-table">

                    <div className="table-header">
                        <span>Skill Name</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (

                        <p style={{ padding: "25px", color: "#c4b5fd" }}>
                            Loading skills...
                        </p>

                    ) : skills.length === 0 ? (

                        <p style={{ padding: "25px", color: "#aaa" }}>
                            No skills available.
                        </p>

                    ) : (

                        skills.map((skill) => (

                            <div className="skill-row" key={skill.id}>

                                <div>
                                    <span>{skill.name}</span>

                                    <small style={{
                                        display: "block",
                                        color: "#a78bfa",
                                        marginTop: "5px"
                                    }}>
                                        {skill.category}
                                    </small>
                                </div>

                                <div className="skill-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(skill)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(skill.id)}
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

export default SkillsManage;