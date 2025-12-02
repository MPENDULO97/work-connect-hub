import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [projectType, setProjectType] = useState("fixed");
  const [skills, setSkills] = useState("");
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        navigate("/auth");
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !budgetMin || !budgetMax) {
      alert("Please fill in all required fields");
      return;
    }

    setPosting(true);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          category,
          budgetMin: parseFloat(budgetMin),
          budgetMax: parseFloat(budgetMax),
          projectType,
          skills: skills.split(",").map(s => s.trim()).filter(s => s),
          locationName
        })
      });

      if (response.ok) {
        alert("Job posted successfully!");
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert("Failed to post job: " + (error.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: "white", 
        borderBottom: "1px solid #e5e7eb",
        padding: "20px"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Post a Job
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "40px", 
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
            Hire a Freelancer
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            Post your job and get proposals from talented freelancers
          </p>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Title */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a React Website"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe your project in detail..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Project Type */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Project Type *
              </label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    value="fixed"
                    checked={projectType === "fixed"}
                    onChange={(e) => setProjectType(e.target.value)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Fixed Price</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    value="hourly"
                    checked={projectType === "hourly"}
                    onChange={(e) => setProjectType(e.target.value)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Hourly Rate</span>
                </label>
              </div>
            </div>

            {/* Budget */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                  Min Budget (ZAR) *
                </label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="e.g., 5000"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "16px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                  Max Budget (ZAR) *
                </label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="e.g., 10000"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Location */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., Johannesburg, South Africa"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Post Button */}
            <button
              onClick={handlePost}
              disabled={posting}
              style={{
                padding: "14px",
                backgroundColor: posting ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: posting ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px",
                marginTop: "10px"
              }}
            >
              {posting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
