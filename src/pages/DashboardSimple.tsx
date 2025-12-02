import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardSimple() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    console.log("Dashboard: Checking auth, token:", token ? "EXISTS" : "MISSING");

    if (!token) {
      console.log("Dashboard: No token, redirecting to /auth");
      navigate("/auth");
      return;
    }

    try {
      console.log("Dashboard: Fetching user data...");
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Dashboard: Response status:", response.status);

      if (!response.ok) {
        console.error("Dashboard: Auth failed, status:", response.status);
        localStorage.removeItem('authToken');
        navigate("/auth");
        return;
      }

      const userData = await response.json();
      console.log("Dashboard: User data received:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Dashboard: Error fetching user:", error);
      localStorage.removeItem('authToken');
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('authToken');
    navigate("/auth");
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ 
          width: "50px", 
          height: "50px", 
          border: "5px solid #e5e7eb", 
          borderTop: "5px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p>Loading dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <p>Redirecting to login...</p>
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
            Work Connect
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "40px", 
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
            Welcome, {user.fullName}! 🎉
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            You're successfully logged in to Work Connect
          </p>

          <div style={{ 
            backgroundColor: "#f0fdf4", 
            border: "1px solid #86efac",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#166534" }}>
              ✅ Authentication Working!
            </h3>
            <p style={{ color: "#166534" }}>
              Your login is successful and the dashboard is loading correctly.
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              border: "1px solid #bfdbfe"
            }}>
              <h4 style={{ fontWeight: "600", marginBottom: "5px" }}>Email</h4>
              <p style={{ color: "#1e40af" }}>{user.email}</p>
            </div>

            <div style={{ 
              padding: "20px", 
              backgroundColor: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde68a"
            }}>
              <h4 style={{ fontWeight: "600", marginBottom: "5px" }}>User ID</h4>
              <p style={{ color: "#92400e", fontSize: "14px" }}>{user._id}</p>
            </div>

            <div style={{ 
              padding: "20px", 
              backgroundColor: "#f3e8ff",
              borderRadius: "8px",
              border: "1px solid #e9d5ff"
            }}>
              <h4 style={{ fontWeight: "600", marginBottom: "5px" }}>Roles</h4>
              <p style={{ color: "#6b21a8" }}>
                {user.roles && user.roles.length > 0 
                  ? user.roles.join(", ") 
                  : "No roles assigned"}
              </p>
            </div>
          </div>

          <div style={{ 
            padding: "20px", 
            backgroundColor: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fecaca"
          }}>
            <h4 style={{ fontWeight: "600", marginBottom: "10px", color: "#991b1b" }}>
              🚧 Dashboard Under Construction
            </h4>
            <p style={{ color: "#991b1b", marginBottom: "10px" }}>
              The full dashboard with projects, proposals, and other features is being built.
            </p>
            <p style={{ color: "#991b1b" }}>
              For now, you can see that authentication is working perfectly!
            </p>
          </div>

          {/* Action Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "30px"
          }}>
            {/* Post a Job */}
            <div style={{ 
              padding: "30px", 
              backgroundColor: "#eff6ff",
              borderRadius: "10px",
              border: "2px solid #3b82f6",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => navigate("/post-job")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>💼</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                Post a Job
              </h3>
              <p style={{ color: "#1e40af", marginBottom: "15px" }}>
                Hire talented freelancers for your projects
              </p>
              <button style={{
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
              }}>
                Post Job
              </button>
            </div>

            {/* Browse Jobs */}
            <div style={{ 
              padding: "30px", 
              backgroundColor: "#f0fdf4",
              borderRadius: "10px",
              border: "2px solid #10b981",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => navigate("/browse-jobs")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔍</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                Browse Jobs
              </h3>
              <p style={{ color: "#166534", marginBottom: "15px" }}>
                Find freelance work that matches your skills
              </p>
              <button style={{
                padding: "10px 20px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
              }}>
                Browse Jobs
              </button>
            </div>

            {/* Profile Settings */}
            <div style={{ 
              padding: "30px", 
              backgroundColor: "#fef3c7",
              borderRadius: "10px",
              border: "2px solid #f59e0b",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => navigate("/profile")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚙️</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                Profile Settings
              </h3>
              <p style={{ color: "#92400e", marginBottom: "15px" }}>
                Update your profile and preferences
              </p>
              <button style={{
                padding: "10px 20px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
              }}>
                Edit Profile
              </button>
            </div>

            {/* View Map */}
            <div style={{ 
              padding: "30px", 
              backgroundColor: "#f3e8ff",
              borderRadius: "10px",
              border: "2px solid #a855f7",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => navigate("/map")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>🗺️</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                Job Map
              </h3>
              <p style={{ color: "#6b21a8", marginBottom: "15px" }}>
                See nearby jobs on an interactive map
              </p>
              <button style={{
                padding: "10px 20px",
                backgroundColor: "#a855f7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
              }}>
                View Map
              </button>
            </div>
          </div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
