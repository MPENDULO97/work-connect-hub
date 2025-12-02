import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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
      
      // Populate form
      setFullName(userData.fullName || "");
      setBio(userData.bio || "");
      setLocation(userData.location || "");
      setSkills(userData.skills?.join(", ") || "");
      setHourlyRate(userData.hourlyRate?.toString() || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          bio,
          location,
          skills: skills.split(",").map(s => s.trim()).filter(s => s),
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined
        })
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        loadProfile();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    } finally {
      setSaving(false);
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
        <p>Loading profile...</p>
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
            Profile Settings
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
            Edit Your Profile
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            Update your information to help clients and freelancers find you
          </p>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
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

            {/* Location */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

            {/* Skills */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, Design"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Hourly Rate (ZAR)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g., 500"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Roles (Read-only) */}
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                Your Roles
              </label>
              <div style={{ 
                padding: "12px",
                backgroundColor: "#f3f4f6",
                borderRadius: "5px",
                color: "#6b7280"
              }}>
                {user.roles && user.roles.length > 0 
                  ? user.roles.join(", ") 
                  : "No roles assigned"}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "14px",
                backgroundColor: saving ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px",
                marginTop: "10px"
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
