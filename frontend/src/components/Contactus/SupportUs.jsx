import React, { useState } from "react";
import supportImage from "../../assets/contact-us/contactimage.jpg";
import Footer from "../Footer/Footer.jsx";

function SupportUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents page reload
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("/support/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(`✅ ${data.message}`);

      if (data.count) {
        console.log("Total Supporters:", data.count);
      }
      setEmail(""); // Clear input after success
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };
  

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "50px",
          padding: "37px",
          background: "linear-gradient(to bottom, #D7F1FF 0%, #62B5E2 100%)",
        }}
      >
        {/* Left Image */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "500px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={supportImage}
            alt="Support Us"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "456px",
              border: "10px solid #EDF9FF",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Support Form */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "480px",
            backgroundColor: "#D7F1FF",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                fontFamily: "Montserrat, sans-serif",
                background:
                  "linear-gradient(to right, #000000 0%, #967A7A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Support Us
            </h1>
            <p style={{ fontSize: "1rem", color: "#333", marginTop: "10px" }}>
              Join our growing family of supporters and help us make a bigger
              impact! Simply register your email below to stay connected and
              show your support for our mission.
            </p>
          </div>

          {/* Email Field */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600" }}>Your Email:</label>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid black",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  border: "none",
                  backgroundColor: "#62B5E2",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                Become a Supporter
              </button>
            </div>
          </form>

          {/* Success/Error Message */}
          {message && (
            <p
              style={{
                marginTop: "15px",
                color: message.startsWith("✅") ? "green" : "red",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SupportUs;
