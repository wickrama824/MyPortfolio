import { useState, useEffect } from "react";
import "./Education.css";

const API_URL = "https://kulakshee-portfolio-api.vercel.app/api/education";

function Education() {

    const [educationData, setEducationData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadEducation() {
        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load education details");
            }

            const data = await response.json();

            const formattedData = data.map((item) => ({
                id: item.id,
                degree: item.qualification,
                institution: item.institution,
                startYear: item.start_year,
                endYear: item.end_year,
                description: item.description
            }));

            setEducationData(formattedData);

        } catch (error) {

            console.error("Education Fetch Error:", error);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        loadEducation();

        function updateEducation() {
            loadEducation();
        }

        window.addEventListener("educationUpdated", updateEducation);

        return () => {
            window.removeEventListener("educationUpdated", updateEducation);
        };

    }, []);

    return (
        <section className="education-section" id="education">

            <div className="education-glow education-glow-one"></div>
            <div className="education-glow education-glow-two"></div>

            <div className="education-heading">

                <span>MY LEARNING JOURNEY</span>

                <h1>
                    My <span>Education</span>
                </h1>

                <p>
                    My academic journey and the knowledge
                    I'm building along the way.
                </p>

            </div>

            <div className="education-timeline">

                {loading ? (

                    <p className="no-education">
                        Loading education details...
                    </p>

                ) : educationData.length === 0 ? (

                    <p className="no-education">
                        Education details will be updated soon.
                    </p>

                ) : (

                    educationData.map((item, index) => (

                        <div
                            className={`education-item ${
                                index % 2 === 0 ? "left" : "right"
                            }`}
                            key={item.id}
                        >

                            <div className="education-dot"></div>

                            <div className="education-card">

                                <div className="education-card-top">

                                    <div className="education-icon">
                                        🎓
                                    </div>

                                    <span className="education-year">
                                        {item.startYear} - {item.endYear || "Present"}
                                    </span>

                                </div>

                                <h2>{item.degree}</h2>

                                <h3>{item.institution}</h3>

                                <p>{item.description}</p>

                                <div className="education-status">

                                    <span></span>

                                    {item.endYear
                                        ? "Completed / In Progress"
                                        : "Currently Studying"}

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>
    );
}

export default Education;