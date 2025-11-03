import React, { useState, useEffect } from "react";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;
function Footer() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // Use existing ranking endpoint which returns all users in `data`.
        // Count total users by length of the returned array so we don't need
        // a separate backend endpoint for user count.
        const resp = await fetch(`${apiURL || ''}/v1/ranking`);
        const result = await resp.json();
        if (resp.ok && result && result.success && Array.isArray(result.data)) {
          setUserCount(result.data.length);
        } else if (resp.ok && Array.isArray(result)) {
          // In case the endpoint returns a raw array (fallback), use its length
          setUserCount(result.length);
        } else {
          // fallback to previous supporter count endpoint if available
          try {
            const response2 = await fetch(`${apiURL || ''}/support/count`);
            const data2 = await response2.json();
            if (response2.ok && data2 && typeof data2.count === 'number') {
              setUserCount(data2.count);
            } else {
              console.error('Failed to fetch user count from both endpoints');
            }
          } catch (err2) {
            console.error('Error fetching user count fallback:', err2);
          }
        }
      } catch (err) {
        console.error('Error fetching user count:', err);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#124D96",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "20px 5vw",
        rowGap: "20px",
        columnGap: "40px",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: "250px",
          maxWidth: "600px",
          textAlign: "left",
        }}
      >
        <h2
          style={{
            fontWeight: 600,
            color: "white",
            marginBottom: "10px",
            fontSize: "18px",
          }}
        >
          Your trusted platform for SSB interview preparation.
        </h2>
        <h2
          style={{
            fontWeight: 300,
            color: "white",
            fontSize: "14px",
            margin: 0,
          }}
        >
          © 2025 Prashikshan. All Rights Reserved.
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "55px",
          width: "180px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            color: "#124D96",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {userCount} Users
        </h3>
      </div>
    </div>
  );
}

export default Footer;
