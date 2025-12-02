import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BrowseJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.filter((job: any) => job.status === 'open'));
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (min: number, max: number) => {
    return `R${min.toLocaleString()} - R${max.toLocaleString()}`;
  };

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
            Browse Jobs
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
        maxWidth: "1200px", 
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
            Available Jobs
          </h2>
          <p style={{ color: "#6b7280" }}>
            {loading ? "Loading jobs..." : `${jobs.length} jobs available`}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ 
            backgroundColor: "white", 
            padding: "60px", 
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>💼</div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
              No Jobs Available Yet
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Be the first to post a job!
            </p>
            <button
              onClick={() => navigate("/post-job")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Post a Job
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {jobs.map((job) => (
              <div 
                key={job._id}
                style={{ 
                  backgroundColor: "white", 
                  padding: "30px", 
                  borderRadius: "10px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "8px" }}>
                      {job.title}
                    </h3>
                    {job.category && (
                      <span style={{ 
                        display: "inline-block",
                        padding: "4px 12px",
                        backgroundColor: "#eff6ff",
                        color: "#1e40af",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        {job.category}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>
                      {formatBudget(job.budgetMin, job.budgetMax)}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      {job.projectType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                    </div>
                  </div>
                </div>

                <p style={{ color: "#374151", marginBottom: "15px", lineHeight: "1.6" }}>
                  {job.description}
                </p>

                {job.skills && job.skills.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#6b7280" }}>
                      Required Skills:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {job.skills.map((skill: string, index: number) => (
                        <span 
                          key={index}
                          style={{ 
                            padding: "4px 12px",
                            backgroundColor: "#f3f4f6",
                            color: "#374151",
                            borderRadius: "5px",
                            fontSize: "14px"
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.locationName && (
                  <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "15px" }}>
                    📍 {job.locationName}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={() => alert("Proposal feature coming soon!")}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Submit Proposal
                  </button>
                  <button
                    onClick={() => alert("View details feature coming soon!")}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "white",
                      color: "#3b82f6",
                      border: "1px solid #3b82f6",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
