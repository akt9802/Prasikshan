import React, { useEffect, useState } from "react";

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

        const response = await fetch("http://localhost:3000/v1/userdetails", {
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
      <h1>User Details</h1>
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
          <p>
            <strong>Improvements:</strong> {userDetails.improvements}
          </p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default UserDetails;
