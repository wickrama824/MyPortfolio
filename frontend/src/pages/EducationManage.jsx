import { useState, useEffect } from "react";
import "./EducationManage.css";

const API_URL = "http://localhost:5000/api/education";

const defaultEducation = [
    {
        degree: "Software Engineering",
        institution: "University",
        startYear: "2025",
        endYear: "2029",
        description: "Currently studying Software Engineering."
    }
];

function EducationManage() {

    const [education, setEducation] = useState([]);

    const [formData, setFormData] = useState({
        degree: "",
        institution: "",
        startYear: "",
        endYear: "",
        description: ""
    });

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("adminToken");

    // LOAD EDUCATION FROM DATABASE
    async function loadEducation() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !Array.isArray(data)) {
                throw new Error("Failed to load education details.");
            }

            // Add previous default education if database is empty
            if (data.length === 0 && token) {

                for (const item of defaultEducation) {

                    const seedResponse = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            institution: item.institution,
                            qualification: item.degree,
                            description: item.description,
                            start_year: item.startYear,
                            end_year: item.endYear
                        })
                    });

                    if (!seedResponse.ok) {
                        throw new Error("Failed to save default education.");
                    }
                }

                const updatedResponse = await fetch(API_URL);
                const updatedData = await updatedResponse.json();

                setEducation(updatedData);

            } else {
                setEducation(data);
            }

        } catch (error) {
            console.error("Education Loading Error:", error);
            alert(error.message);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEducation();
    }, []);

    // RESET FORM
    function resetForm() {
        setFormData({
            degree: "",
            institution: "",
            startYear: "",
            endYear: "",
            description: ""
        });

        setEditId(null);
    }

    // HANDLE INPUT CHANGES
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // ADD / UPDATE EDUCATION
    async function handleSubmit(e) {
        e.preventDefault();

        if (
            !formData.degree.trim() ||
            !formData.institution.trim() ||
            !formData.startYear.trim()
        ) {
            alert("Please fill all required fields!");
            return;
        }

        if (!token) {
            alert("Please login again.");
            return;
        }

        setSaving(true);

        const educationData = {
            institution: formData.institution.trim(),
            qualification: formData.degree.trim(),
            description: formData.description.trim(),
            start_year: formData.startYear,
            end_year: formData.endYear
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
                body: JSON.stringify(educationData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save education.");
            }

            alert(
                editId !== null
                    ? "Education updated successfully!"
                    : "Education added successfully!"
            );

            resetForm();

            await loadEducation();

            window.dispatchEvent(new Event("educationUpdated"));

        } catch (error) {
            console.error("Education Save Error:", error);
            alert(error.message);

        } finally {
            setSaving(false);
        }
    }

    // EDIT EDUCATION
    function handleEdit(item) {

        setFormData({
            degree: item.qualification || "",
            institution: item.institution || "",
            startYear: item.start_year || "",
            endYear: item.end_year || "",
            description: item.description || ""
        });

        setEditId(item.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // DELETE EDUCATION
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this education?"
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
                throw new Error(data.message || "Failed to delete education.");
            }

            setEducation(previous =>
                previous.filter(item => item.id !== id)
            );

            alert("Education deleted successfully!");

            window.dispatchEvent(new Event("educationUpdated"));

        } catch (error) {
            console.error("Education Delete Error:", error);
            alert(error.message);
        }
    }

    function handleCancel() {
        resetForm();
    }

    return (
        <div className="education-manage">

            <div className="manage-header">
                <h1>Education Management</h1>
                <p>Manage your educational qualifications.</p>
            </div>

            {/* Education Form */}

            <div className="education-form-container">

                <h2>
                    {editId !== null
                        ? "Edit Education"
                        : "Add New Education"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Degree / Course Name *</label>

                    <input
                        type="text"
                        name="degree"
                        placeholder="Enter degree or course"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                    />

                    <label>Institution Name *</label>

                    <input
                        type="text"
                        name="institution"
                        placeholder="Enter institution name"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                    />

                    <label>Start Year *</label>

                    <input
                        type="number"
                        name="startYear"
                        placeholder="2025"
                        value={formData.startYear}
                        onChange={handleChange}
                        required
                    />

                    <label>End Year</label>

                    <input
                        type="number"
                        name="endYear"
                        placeholder="2029"
                        value={formData.endYear}
                        onChange={handleChange}
                    />

                    <label>Description</label>

                    <textarea
                        name="description"
                        rows="4"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <div className="education-form-buttons">

                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editId !== null
                                    ? "Update Education"
                                    : "Add Education"}
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

            {/* Education List */}

            <div className="education-list">

                <h2>My Education ({education.length})</h2>

                <div className="education-container">

                    {loading ? (

                        <p>Loading education details...</p>

                    ) : education.length === 0 ? (

                        <p>No education details added yet.</p>

                    ) : (

                        education.map((item) => (

                            <div
                                className="education-card"
                                key={item.id}
                            >

                                <h3>{item.qualification}</h3>

                                <h4>{item.institution}</h4>

                                <p>
                                    {item.start_year} - {item.end_year || "Present"}
                                </p>

                                <p>{item.description}</p>

                                <div className="education-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
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

export default EducationManage;