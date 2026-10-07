import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManageSkills.css";

function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // ✅ Fetch all skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/skills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(res.data);
      } catch (err) {
        console.error("Error fetching skills", err);
      }
    };
    fetchSkills();
  }, []);

  // ✅ Delete skill
  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(skills.filter((skill) => skill._id !== id));
      setSelectedSkill(null); // close modal if open
    } catch (err) {
      console.error("Error deleting skill", err);
    }
  };

  return (
    <div className="manage-skills-container">
      <h2 className="page-title">Manage Skills</h2>

      <div className="skills-grid">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div key={skill._id} className="skill-card">
              <div className="skill-card-image-wrapper">
                <img
                  src={`http://localhost:5000/${skill.image || "default-skill.png"}`}
                  alt={skill.title || "Untitled Skill"}
                  className="skill-card-image"
                />
              </div>
              <h3 className="skill-card-title">{skill.title || "Untitled Skill"}</h3>
              <p><strong>Offered By:</strong> {skill.user?.username || "N/A"}</p>
              <p>
                <strong>Source:</strong>{" "}
                {skill.source === "WomenOnlyZone" ? "Women-Only Skill Zone" : "Marketplace"}
              </p>
              <div className="skill-card-actions">
                <button className="view-btn" onClick={() => setSelectedSkill(skill)}>
                  View
                </button>
                <button className="delete-btn" onClick={() => deleteSkill(skill._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No skills available</p>
        )}
      </div>

      {/* ✅ Modal for full details */}
      {selectedSkill && (
        <div className="modal-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedSkill.title || "Untitled Skill"}</h2>
            <img
              src={`http://localhost:5000/${selectedSkill.image || "default-skill.png"}`}
              alt={selectedSkill.title}
              className="modal-skill-image"
            />
            <div className="modal-details">
              <p><strong>First Name:</strong> {selectedSkill.user?.firstName || "N/A"}</p>
              <p><strong>Last Name:</strong> {selectedSkill.user?.lastName || "N/A"}</p>
              <p><strong>Username:</strong> {selectedSkill.user?.username || "N/A"}</p>
              <p><strong>Description:</strong> {selectedSkill.description || "N/A"}</p>
              <p><strong>Location:</strong> {selectedSkill.location || "N/A"}</p>
              <p><strong>Anonymous:</strong> {selectedSkill.anonymous ? "Yes" : "No"}</p>
              <p>
                <strong>Source:</strong>{" "}
                {selectedSkill.source === "WomenOnlyZone" ? "Women-Only Skill Zone" : "Marketplace"}
              </p>
              <div className="cnic-images">
                {selectedSkill.user?.profilePicture && (
                  <img
                    src={`http://localhost:5000/${selectedSkill.user.profilePicture}`}
                    alt="Profile"
                    className="cnic-thumbnail"
                  />
                )}
                {selectedSkill.user?.cnicFrontPicture && (
                  <img
                    src={`http://localhost:5000/${selectedSkill.user.cnicFrontPicture}`}
                    alt="CNIC Front"
                    className="cnic-thumbnail"
                  />
                )}
                {selectedSkill.user?.cnicBackPicture && (
                  <img
                    src={`http://localhost:5000/${selectedSkill.user.cnicBackPicture}`}
                    alt="CNIC Back"
                    className="cnic-thumbnail"
                  />
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="delete-btn" onClick={() => deleteSkill(selectedSkill._id)}>
                Delete
              </button>
              <button className="close-btn" onClick={() => setSelectedSkill(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSkills;
