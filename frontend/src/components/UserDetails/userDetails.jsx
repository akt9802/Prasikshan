import OirScore from "../../components/Charts/OirScore.jsx";
import MonthlyTest from "../../components/Charts/MonthlyTest.jsx";
import PPDTScore from "../../components/Charts/PPDTScore.jsx";
import TotalTest from "../../components/Charts/TotalTest.jsx";
import React, { useEffect, useState } from "react";
import TatScore from "../../components/Charts/TatScore.jsx";
import WatScore from "../../components/Charts/WatScore.jsx";
import SrtScore from "../../components/Charts/SrtScore.jsx";
import Lecturette from "../../components/Charts/LecturetteScore.jsx";

const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedTest, setSelectedTest] = useState("OIR"); // Add state for selected test

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No token found. Please sign in.");
          return;
        }

        const response = await fetch(`${apiURL}/v1/userdetails`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          setUserDetails(data);
        } else {
          alert(data.message || "Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("An error occurred while fetching user details.");
      }
    };

    fetchUserDetails();
  }, []);

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally show a confirmation message
    alert("You have been logged out successfully!");

    // Redirect to login page or refresh the page
    window.location.href = "/"; // or use React Router's navigate
  };

  // Function to render the selected chart component
  const renderSelectedChart = () => {
    switch (selectedTest) {
      case "OIR":
        return <OirScore userDetails={userDetails} />;
      case "PPDT":
        return <PPDTScore userDetails={userDetails} />;
      case "TAT":
        return (
          <div>
            <TatScore userDetails={userDetails} />
          </div>
        );
      case "WAT":
        return (
          <div>
            <WatScore userDetails={userDetails} />
          </div>
        );
      case "SRT":
        return (
          <div>
            <SrtScore userDetails={userDetails} />
          </div>
        );
      case "LECTURETTE":
        return (
          <div>
            <Lecturette userDetails={userDetails} />
          </div>
        );
      default:
        return <OirScore />;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {userDetails ? (
        <div>
          <div
            style={{
              textAlign: "center",
              marginBottom: 5,
              padding: "20px 0",
              backgroundColor: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              position: "relative", // Added for button positioning
            }}
          >
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#c82333";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              Logout
            </button>

            <h1
              style={{
                fontWeight: "bold",
                fontSize: "2.5rem",
                margin: 0,
                color: "#124D96",
              }}
            >
              Welcome, {userDetails.name}!
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#666",
                marginTop: 8,
                margin: 0,
              }}
            >
              Track your test performance and progress
            </p>
          </div>
          {/* Charts Container */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: 30,
              justifyItems: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 600 }}>
              <TotalTest userDetails={userDetails} />
            </div>
            <div style={{ width: "100%", maxWidth: 800 }}>
              <MonthlyTest userDetails={userDetails} />
            </div>
          </div>

          {/* Test Score Selection Section */}
          <div
            style={{
              margin: "50px auto",
              padding: "50px",
              backgroundColor: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              maxWidth: 1200,
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#124D96",
                marginBottom: 30,
              }}
            >
              Check Your Score Chart
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: 30,
                alignItems: "start",
              }}
            >
              {/* Test Type Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 15,
                }}
              >
                <button
                  onClick={() => setSelectedTest("OIR")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "OIR" ? "#0f3d6b" : "#1E5799",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "OIR" ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#2a6bb3")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "OIR" ? "#0f3d6b" : "#1E5799")
                  }
                >
                  OIR
                </button>

                <button
                  onClick={() => setSelectedTest("PPDT")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "PPDT" ? "#009688" : "#00C49F",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "PPDT" ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#00d4a8")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "PPDT" ? "#009688" : "#00C49F")
                  }
                >
                  PPDT
                </button>

                <button
                  onClick={() => setSelectedTest("TAT")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "TAT" ? "#e6940a" : "#FFA500",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "TAT" ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#ffb533")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "TAT" ? "#e6940a" : "#FFA500")
                  }
                >
                  TAT
                </button>

                <button
                  onClick={() => setSelectedTest("WAT")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "WAT" ? "#e6692e" : "#FF8042",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "WAT" ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#ff9666")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "WAT" ? "#e6692e" : "#FF8042")
                  }
                >
                  WAT
                </button>

                <button
                  onClick={() => setSelectedTest("SRT")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "SRT" ? "#6c63d2" : "#8884d8",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "SRT" ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#9a98e8")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "SRT" ? "#6c63d2" : "#8884d8")
                  }
                >
                  SRT
                </button>

                <button
                  onClick={() => setSelectedTest("LECTURETTE")}
                  style={{
                    padding: "15px 20px",
                    backgroundColor:
                      selectedTest === "LECTURETTE" ? "#6bb36b" : "#82ca9d",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform:
                      selectedTest === "LECTURETTE"
                        ? "scale(1.05)"
                        : "scale(1)",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#95d4a8")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor =
                      selectedTest === "LECTURETTE" ? "#6bb36b" : "#82ca9d")
                  }
                >
                  LECTURETTE
                </button>
              </div>

              {/* Chart Area */}
              <div
                style={{
                  borderRadius: 8,
                  minHeight: 300,
                }}
              >
                {renderSelectedChart()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#666",
            }}
          >
            Loading user details...
          </p>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
