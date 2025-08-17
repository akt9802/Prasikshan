import React, { useEffect, useState } from "react";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;
function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);

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
        if (response.ok) {
          setUserDetails(data); // Set user details in state
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

  return (
    <div>
      {userDetails ? (
        <div>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Tests Taken:</strong> {userDetails.testsTaken}
          </p>

        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default UserDetails;
