import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";

export default function AuthSimple() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Test backend connection on mount
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(data => console.log("Backend test:", data))
      .catch(err => console.error("Backend connection failed:", err));
  }, []);

  const handleLogin = async () => {
    console.log("LOGIN CLICKED!");
    console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("Email:", email);
    setError("");
    setLoading(true);

    try {
      console.log("Calling authAPI.signIn...");
      const result = await authAPI.signIn(email, password);
      console.log("Login result:", result);
      
      // Check if token was stored
      const token = localStorage.getItem('authToken');
      console.log("Token stored:", token ? "YES" : "NO");
      console.log("Token value:", token?.substring(0, 20) + "...");
      
      console.log("About to navigate to /dashboard");
      console.log("Current URL:", window.location.href);
      
      try {
        console.log("Attempting window.location.href = '/dashboard'");
        window.location.href = "/dashboard";
        console.log("Navigation command executed");
      } catch (navError) {
        console.error("Navigation error:", navError);
        alert("Navigation failed: " + navError);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error message:", err.message);
      setError(err.message || "Login failed");
      alert("Login failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    console.log("SIGNUP CLICKED!");
    setError("");

    if (!isFreelancer && !isClient) {
      setError("Please select at least one role");
      alert("Please select at least one role");
      return;
    }

    setLoading(true);

    try {
      const roles = [];
      if (isFreelancer) roles.push("freelancer");
      if (isClient) roles.push("client");

      await authAPI.signUp(email, password, { fullName, roles });
      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // If user already exists, try logging them in instead
      if (err.message && err.message.toLowerCase().includes("already exists")) {
        console.log("User exists, trying to login...");
        try {
          await authAPI.signIn(email, password);
          console.log("Auto-login successful, redirecting...");
          window.location.href = "/dashboard";
          return;
        } catch (loginErr: any) {
          setError("User exists but login failed. Please use the Login tab.");
          alert("User exists but login failed: " + (loginErr.message || "Wrong password?"));
        }
      } else {
        setError(err.message || "Signup failed");
        alert("Signup failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "40px", 
        borderRadius: "10px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
          Work Connect
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "30px", textAlign: "center" }}>
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </p>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => {
              console.log("Switching to LOGIN");
              setIsLogin(true);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: isLogin ? "#3b82f6" : "#e5e7eb",
              color: isLogin ? "white" : "#374151",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              console.log("Switching to SIGNUP");
              setIsLogin(false);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: !isLogin ? "#3b82f6" : "#e5e7eb",
              color: !isLogin ? "white" : "#374151",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "#fee2e2", 
            color: "#991b1b", 
            padding: "10px", 
            borderRadius: "5px", 
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        {isLogin && (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "500" }}>
                I want to:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isFreelancer}
                    onChange={(e) => setIsFreelancer(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Find freelance work</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isClient}
                    onChange={(e) => setIsClient(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Hire freelancers</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        )}

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          <a href="/" style={{ color: "#3b82f6", textDecoration: "none" }}>
            ← Back to home
          </a>
        </div>

        {/* Debug button */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => {
              console.log("Test navigation clicked");
              console.log("Current location:", window.location.href);
              console.log("Token:", localStorage.getItem('authToken'));
              window.location.href = "/dashboard";
            }}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🔧 Test Direct Navigation to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
