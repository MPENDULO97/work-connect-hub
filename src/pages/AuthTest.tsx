import { useState } from "react";

// Minimal test page to debug button clicks
export default function AuthTest() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    console.log("Button clicked!");
    alert("Button works!");
    setClickCount(clickCount + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    alert("Form submitted!");
  };

  return (
    <div style={{ padding: "50px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Button Test Page</h1>
      <p>Click count: {clickCount}</p>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Plain HTML button */}
        <button
          onClick={handleClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Plain HTML Button
        </button>

        {/* Button in form */}
        <form onSubmit={handleFormSubmit}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Form Submit Button
          </button>
        </form>

        {/* Button with onClick */}
        <button
          type="button"
          onClick={() => {
            console.log("Inline click!");
            alert("Inline click works!");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Inline onClick Button
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Try clicking each button</li>
          <li>Check browser console (F12)</li>
          <li>Look for console.log messages</li>
          <li>If buttons work here but not on Auth page, it's a component issue</li>
        </ol>
      </div>
    </div>
  );
}
