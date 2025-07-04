import React from "react";
import userLogo from "../../assets/user.png";

function SmallCardHome({ name, title, text }) {
  return (
    <>
      <div
        className="hover-card"
        style={{
          height: "340px",
          width: "320px",
          backgroundColor: "#FFFFFF",
          borderRadius: "15px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // subtle initial shadow
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            paddingLeft: "40px",
            paddingTop: "20px",
          }}
        >
          <div>
            <img src={userLogo} alt="User" width={38} height={38} />
          </div>
          <div>
            <h3
              style={{
                fontWeight: "bolder",
              }}
            >
              {name}
            </h3>
            <h6>{title}</h6>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "30px",
            paddingRight: "20px",
            paddingTop: "20px",
          }}
        >
          {text}
        </div>
      </div>

      {/* Embedded CSS for hover effect */}
      <style>{`
        .hover-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default SmallCardHome;
