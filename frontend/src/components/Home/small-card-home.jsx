import React from 'react'
import userLogo from "../../assets/user.png";
function SmallCardHome({name, title, text}) {
  return (
    <div
      style={{
        height: "340px",
        width: "320px",
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          // backgroundColor: "red",
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
  );
}

export default SmallCardHome;
